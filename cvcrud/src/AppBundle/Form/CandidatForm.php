<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
namespace AppBundle\Form;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class CandidatForm extends AbstractType{
    /**
     * @param FormBuilderInterface $builder
     * @param array $option
     */
    public function buildForm(FormBuilderInterface $builder, array $options) {
        $builder
                ->add('nom', TextType::class, [
                    'label'=>'Nom',
                     'attr' => [
                            'class'=>'form-control'
                    ],
                ])
                ->add('prenom', TextType::class, [
                    'label'=>'Prenom',
                     'attr' => [
                            'class'=>'form-control'
                    ],
                ])
                ->add('description', TextType::class, [
                    'label'=>'Description',
                     'attr' => [
                            'class'=>'form-control'
                    ],
                ])
                ->add('entreprise', TextType::class, [
                    'label'=>'Entreprise actuelle',
                     'attr' => [
                            'class'=>'form-control'
                    ],
                ])
                ->add('date_dispo', DateType::class, [
                    'label'=>'Date de disponibilité',
                    'widget' => 'single_text',
                     'attr' => [
                            'class'=>'form-control'
                    ],
                ])
                ->add('localisation', TextType::class, [
                    'label'=>'Localisation souhaitée',
                     'attr' => [
                            'class'=>'form-control'
                    ],
                ])
                ->add('email', EmailType::class, [
                    'label'=>'Adresse email',
                    'required'=>false,
                    'attr'=>[
                        'class'=>'form-control'
                    ],
                ])
                 ->add('linkedin', TextType::class, [
                    'label'=>'Lien linkedin :',
                     'attr' => [
                            'class'=>'form-control'
                    ],
                ])
                 ->add('cv', TextType::class, [
                    'label'=>'Lien du CV :',
                     'attr' => [
                            'class'=>'form-control'
                    ],
                ])
                 ->add('photo', TextType::class, [
                    'label'=>'Lien de la photo : ',
                     'attr' => [
                            'class'=>'form-control'
                    ],
                ])
                ->add('save', SubmitType::class, array(
                    'label' => "Valider",
                    'attr' => array('class' => 'btn btn-primary')
                ));
    }
    public function configureOption(OptionsResolver $resolver) {
        $resolver->setDefaults(['data_class'=>'AppBundle\Entity\Candidat']);
    }
}
