<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use AppBundle\Entity\Candidat;
use AppBundle\Entity\Langage;
use AppBundle\Entity\Projet;
use AppBundle\Form\CandidatForm;
use AppBundle\Form\ProjetForm;

/**
 * Description of AdminController
 *
 * @author Sanae BELHAJ
 */
class AdminController extends Controller{
    
     /**
     * @Route("/admin", name="admin")
     */
    public function adminAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $candidat = $em->getRepository('AppBundle:Candidat')->find(1);
        $formCandidat = $this->createForm(CandidatForm::class, $candidat);
        
        //MaJ Candidat
        $formCandidat->handleRequest($request);
        if($formCandidat->isValid()){
           $em->persist($candidat);
           $em->flush();
           $this->addFlash('success', "Les informations du candidat ont été correctement modifiées.");
        }

        //Ajout Projet
        $projet = new Projet();
        $formProjet = $this->createForm(ProjetForm::class, $projet);
        $formProjet->handleRequest($request);
        if($formProjet->isValid()){
           $em->persist($projet);
           $projet->setCandidat_id($candidat);
           $em->flush();
           $this->addFlash('success', "Le projet a correctement été enregistré");

           //Ajout Langages associés
           $keywords = explode(",", $projet->getApilangages());
           if(is_array($keywords)){
            foreach ($keywords as $keyword) {
                $langage = new Langage();
                $em->persist($langage);
                $langage->setNom($keyword);
                $langage->setProjet_id($projet);
                $em->flush();
            }
           }else{
                $langage = new Langage();
                $em->persist($langage);
                $langage->setNom($keywords);
                $langage->setProjet_id($projet);
                $em->flush();
           }
        }

        //Récupération projets + langages associés
        $projets = $em->getRepository('AppBundle:Projet')->findAll();
        foreach ($projets as $projet) {
            $array = [];
            $langages = $em->getRepository('AppBundle:Langage')->findBy(['projet_id' => $projet]);
            foreach ($langages as $langage)
                $array[] = $langage->getNom();
            $projet->setApilangages(implode(",",$array));
        }

        return $this->render('admin\admin.html.twig', [
            'candidat'=>$candidat, 
            'formCandidat'=>$formCandidat->createView(), 
            'formProjet'=>$formProjet->createView(), 
            'projets'=>$projets
        ]);
    }

    /**
     * @Route("/projet/edit/{id}", name="edit_projet")
     */
    public function editProjetAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $projet = $em->getRepository('AppBundle:Projet')->find($id);
        $formProjet = $this->createForm(ProjetForm::class, $projet);
        $formProjet->handleRequest($request);
        if($formProjet->isValid()){
           $em->persist($projet);
           $em->flush();
           $this->addFlash('success', "Le projet a correctement été modifié");

           //Suppression des anciens langages
            $langages = $em->getRepository('AppBundle:Langage')->find($id);
            if($langages){
                if(is_array($langages)){
                    foreach ($langages as $langage) {
                        $em->remove($langage);
                        $em->flush();
                    }
                }
                else{
                    $em->remove($langages);
                    $em->flush();
                }
            }

           //Ajout Langages associés
           $keywords = explode(",", $projet->getApilangages());
           if(is_array($keywords)){
            foreach ($keywords as $keyword) {
                $langage = new Langage();
                $em->persist($langage);
                $langage->setNom($keyword);
                $langage->setProjet_id($projet);
                $em->flush();
            }
           }else{
                $langage = new Langage();
                $em->persist($langage);
                $langage->setNom($keywords);
                $langage->setProjet_id($projet);
                $em->flush();
           }
        }

        return $this->redirectToRoute('admin', []);
    }

    /**
     * @Route("/admin/delete_projet/{id}", name="delete_projet")
     */
    public function deleteProjetAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $langages = $em->getRepository('AppBundle:Langage')->findBy(['projet_id'=>$id]);

        foreach ($langages as $langage) {
            $em->remove($langage);
            $em->flush();
        }

        $projet = $em->getRepository('AppBundle:Projet')->find($id);
        if($projet){
            $em->remove($projet);
            $em->flush();
        }
        return $this->redirectToRoute('admin', []);
    }
}
