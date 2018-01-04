<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Controller;


use AppBundle\Entity\Candidat;
use AppBundle\Form\CandidatForm;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpFoundation\Request;
/**
 * Description of CandidatController
 *
 * @author Sanae BELHAJ
 */
class CandidatController extends Controller{
    
     /**
     * @Route("/candidats", name="candidat")
     */
    public function ProjetsAction(Request $request)
    {
        
        $em = $this->getDoctrine()->getManager();
        $candidat = $em->getRepository('AppBundle:Candidat')->findAll();
      
        return $this->render('candidat\listecandidat.html.twig', [
            'candidat'=>$candidat
        ]);
    }
    
      /**
     * @Route("/addcandidat", name="add_candidat")
     */
    public function addAction(Request $request)
    {
            $candidat = new Candidat();
            $form = $this->createForm(CandidatForm::class, $candidat);
            $form->handleRequest($request);
            if($form->isValid()){
                $em = $this->getDoctrine()->getManager();
                $em->persist($candidat);
                $em->flush();
                return $this->redirectToRoute('add_candidat');
            }
            return $this->render('candidat\add.html.twig', [
                'form'=>$form->createView(),
            ]);
       
    }
        /**
     * @Route("/candidat/edit/{id}", name="edit_candidat")
     */
    public function editAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $projet = $em->getRepository('AppBundle:Candidat')->find($id);
        $form = $this->createForm(CandidatForm::class, $projet);
        $form->handleRequest($request);
        if($form->isValid()){
           $em->persist($projet);
           $em->flush();
           $this->addFlash('success', "Les informations du candidat ont été correctement modifiées.");
           return $this->redirectToRoute('candidat', []);
        }
        return $this->render('candidat\add.html.twig', [
            'form'=>$form->createView(),
        ]);
    }

    /**
     * @Route("/candidat/delete/{id}", name="delete_candidat")
     */
    public function deleteAction(Request $request, $id)
    {
            $em = $this->getDoctrine()->getManager();

            $candidat = $em->getRepository('AppBundle:Candidat')->find($id);
            $em->remove($candidat);
            $em->flush();
            return $this->redirectToRoute('candidat', []);
    }
      
}
