<?php 
namespace AppBundle\Entity;

use Symfony\Component\Validator\Mapping\ClassMetadata;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Type;
use Symfony\Component\Security\Core\User\UserInterface;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\CandidatRepository")
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
     * @ORM\Column(type="string", length=5)
     */
	protected $cv;
	
	
	/**
     * @ORM\Column(type="string", length=100)
     */
	protected $photo;
	
    /**
    * @ORM\OneToMany(targetEntity="Staff", mappedBy="user")
    */
    protected $tocken;


    public function __construct()
    {
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

    function getTocken() {
        return $this->tocken;
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

    function setTocken($tocken) {
        $this->tocken = $tocken;
    }

   
}