<?php 
namespace AppBundle\Entity;

use Symfony\Component\Validator\Mapping\ClassMetadata;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Type;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection; 

/**
 * @ORM\Entity()
 * @ORM\Table(name="langage")
 */

class Langage {

    /**
    * @ORM\Column(type="integer")
    * @ORM\Id
    * @ORM\GeneratedValue(strategy="AUTO")
    */
    protected $id;

    /**
    * @ORM\Column(type="string", length=200)
    */
    public $nom;

   /**
    * @ORM\ManyToOne(targetEntity="Projet", inversedBy="langages")
    * @ORM\JoinColumn(name="projet_id", referencedColumnName="id") 
    */
    public $projet_id;

    function getId() {
        return $this->id;
    }

    function getNom() {
        return $this->nom;
    }

    function getProjet_id() {
        return $this->projet_id;
    }

    function setId($id) {
        $this->id = $id;
    }

    function setNom($nom) {
        $this->nom = $nom;
    }

    function setProjet_id($projet_id) {
        $this->projet_id = $projet_id;
    }
}