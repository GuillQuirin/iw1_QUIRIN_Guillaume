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
     * @ORM\Column(type="string", length=200)
     */
    protected $entreprise;

    /**
     * @ORM\Column(type="datetime", length=100)
     */
    protected $date_dispo;

    /**
     * @ORM\Column(type="string", length=100)
     */
    protected $localisation;
    
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
     * @ORM\Column(type="string", length=200)
     */
    protected $cv;
    
    
    /**
     * @ORM\Column(type="string", length=200)
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

    function getId() {
        return $this->id;
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

    function getEntreprise() {
        return $this->entreprise;
    }

    function getDateDispo() {
        return $this->date_dispo;
    }

    function getLocalisation() {
        return $this->localisation;
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

    function setId($id) {
        $this->id = $id;
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

    function setEntreprise($entreprise) {
        $this->entreprise = $entreprise;
    }

    function setDateDispo($date_dispo) {
        $this->date_dispo = $date_dispo;
    }

    function setLocalisation($localisation) {
        $this->localisation = $localisation;
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