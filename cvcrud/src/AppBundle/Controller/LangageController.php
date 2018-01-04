<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Controller;


use AppBundle\Entity\Langage;
use AppBundle\Form\LangageForm;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpFoundation\Request;
/**
 * Description of LangageController
 *
 * @author Sanae BELHAJ
 */
class LangageController extends Controller{
    
     /**
     * @Route("/langages", name="langage")
     */
    public function LangagesAction(Request $request)
    {
        
        $em = $this->getDoctrine()->getManager();
        $langage = $em->getRepository('AppBundle:Langage')->findAll();
      
        return $this->render('langage\listelangage.html.twig', [
            'langages'=>$langage
        ]);
    }
    
      /**
     * @Route("/addlangage", name="add_langage")
     */
    public function addAction(Request $request)
    {
            $langage = new Langage();
            $form = $this->createForm(LangageForm::class, $langage);
            $form->handleRequest($request);
            if($form->isValid()){
                $em = $this->getDoctrine()->getManager();
                $em->persist($langage);
                $em->flush();
                return $this->redirectToRoute('add_langage');
            }
            return $this->render('langage\add.html.twig', [
                'form'=>$form->createView(),
            ]);
       
    }
        /**
     * @Route("/langage/edit/{id}", name="edit_langage")
     */
    public function editAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $langage = $em->getRepository('AppBundle:Langage')->find($id);
        $form = $this->createForm(LangageForm::class, $langage);
        $form->handleRequest($request);
        if($form->isValid()){
           $em->persist($langage);
           $em->flush();
           $this->addFlash('success', "Les informations de l'association ont été correctement modifiées.");
           return $this->redirectToRoute('langage', []);
        }
        return $this->render('langage\add.html.twig', [
            'form'=>$form->createView(),
        ]);
    }

    /**
     * @Route("/langage/delete/{id}", name="delete_langage")
     */
    public function deleteAction(Request $request, $id)
    {
            $em = $this->getDoctrine()->getManager();

            $langage = $em->getRepository('AppBundle:Langage')->find($id);
            $em->remove($langage);
            $em->flush();
            return $this->redirectToRoute('langage', []);
    }
      
}
