<?php 
namespace AppBundle\Entity;

use Symfony\Component\Validator\Mapping\ClassMetadata;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Type;
use Symfony\Component\Security\Core\User\UserInterface;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ProjetRepository")
 * @ORM\Table(name="projet")
 */

class Projet{

	/**
    * @ORM\Column(type="integer")
    * @ORM\Id
    * @ORM\GeneratedValue(strategy="AUTO")
    */
    protected $id;

   /**
     * @ORM\Column(type="string", length=100)
     */
    protected $titre;
   /**
     * @ORM\Column(type="integer", nullable=true)
     */
    protected $prenium =0;
   /**
     * @ORM\Column(type="string", length=100)
     */
    protected $description;
   /**
     * @ORM\Column(type="string", length=100)
     */
    protected $image;
   /**
     * @ORM\Column(type="string", length=100)
     */
    protected $url;
    function getId() {
        return $this->id;
    }

    function getTitre() {
        return $this->titre;
    }

    function getPrenium() {
        return $this->prenium;
    }

    function getDescription() {
        return $this->description;
    }

    function getImage() {
        return $this->image;
    }

    function getUrl() {
        return $this->url;
    }

    function setId($id) {
        $this->id = $id;
    }

    function setTitre($titre) {
        $this->titre = $titre;
    }

    function setPrenium($prenium) {
        $this->prenium = $prenium;
    }

    function setDescription($description) {
        $this->description = $description;
    }

    function setImage($image) {
        $this->image = $image;
    }

    function setUrl($url) {
        $this->url = $url;
    }


   
}