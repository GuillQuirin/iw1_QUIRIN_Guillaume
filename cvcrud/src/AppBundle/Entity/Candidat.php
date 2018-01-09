<?php 
namespace AppBundle\Entity;

use Symfony\Component\Validator\Mapping\ClassMetadata;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Type;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @ORM\Table(name="candidat")
 */

class Candidat{

    /**
    * @ORM\Column(type="integer")
    * @ORM\Id
    * @ORM\GeneratedValue(strategy="AUTO")
    */
    protected $id;
  
    /**
     * @ORM\Column(type="string", length=100)
     */
    protected $prenom;

    /**
     * @ORM\Column(type="string", length=100)
     */
    protected $nom;
    
    /**
     * @ORM\Column(type="string", length=100)
     */
    protected $description;
    
       
    /**
     * @ORM\Column(type="string", length=100)
     */
    protected $email;
        
    /**
    * @ORM\Column(type="string", length=200)
    */
    protected $linkedin;
    
    /**
     * @ORM\Column(type="string", length=100)
     */
    protected $cv;
    
    
    /**
     * @ORM\Column(type="string", length=100)
     */
    protected $photo;
    
    /**
    * @ORM\OneToMany(targetEntity="Projet", mappedBy="candidat_id") 
    */
    protected $projets;


    public function __construct()
    {
        $this->projets = new ArrayCollection();
    }

    function getPrenom() {
        return $this->prenom;
    }

    function getNom() {
        return $this->nom;
    }

    function getDescription() {
        return $this->description;
    }

    function getLinkedin() {
        return $this->linkedin;
    }

    function getCv() {
        return $this->cv;
    }

    function getPhoto() {
        return $this->photo;
    }

    function getEmail() {
        return $this->email;
    }

    function setNom($nom) {
        $this->nom = $nom;
    }

    function setPrenom($prenom) {
        $this->prenom = $prenom;
    }

    function setDescription($description) {
        $this->description = $description;
    }

    function setLinkedin($linkedin) {
        $this->linkedin = $linkedin;
    }

    function setCv($cv) {
        $this->cv = $cv;
    }

    function setPhoto($photo) {
        $this->photo = $photo;
    } 

    function setEmail($email) {
        $this->email = $email;
    } 
}