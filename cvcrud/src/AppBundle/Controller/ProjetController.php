<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Controller;


use AppBundle\Entity\Projet;
use AppBundle\Form\ProjetForm;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpFoundation\Request;
/**
 * Description of ProjetController
 *
 * @author Sanae BELHAJ
 */
class ProjetController extends Controller{
    
     /**
     * @Route("/projets", name="projet")
     */
    public function ProjetsAction(Request $request)
    {
        
        $em = $this->getDoctrine()->getManager();
        $projet = $em->getRepository('AppBundle:Projet')->findAll();
      
        return $this->render('projet\listeprojet.html.twig', [
            'projets'=>$projet
        ]);
    }
    
      /**
     * @Route("/addprojet", name="add_projet")
     */
    public function addAction(Request $request)
    {
            $projet = new Projet();
            $form = $this->createForm(ProjetForm::class, $projet);
            $form->handleRequest($request);
            if($form->isValid()){
                $em = $this->getDoctrine()->getManager();
                $em->persist($projet);
                $em->flush();
                return $this->redirectToRoute('add_projet');
            }
            return $this->render('projet\add.html.twig', [
                'form'=>$form->createView(),
            ]);
       
    }
        /**
     * @Route("/projet/edit/{id}", name="edit_projet")
     */
    public function editAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $projet = $em->getRepository('AppBundle:Projet')->find($id);
        $form = $this->createForm(ProjetForm::class, $projet);
        $form->handleRequest($request);
        if($form->isValid()){
           $em->persist($projet);
           $em->flush();
           $this->addFlash('success', "Les informations du projet ont été correctement modifiées.");
           return $this->redirectToRoute('projet', []);
        }
        return $this->render('projet\add.html.twig', [
            'form'=>$form->createView(),
        ]);
    }

    /**
     * @Route("/projet/delete/{id}", name="delete_projet")
     */
    public function deleteAction(Request $request, $id)
    {
            $em = $this->getDoctrine()->getManager();

            $projet = $em->getRepository('AppBundle:Projet')->find($id);
            $em->remove($projet);
            $em->flush();
            return $this->redirectToRoute('projet', []);
    }
      
}
