<?php 
namespace AppBundle\Entity;

use Symfony\Component\Validator\Mapping\ClassMetadata;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Type;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
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
    * @ORM\Column(type="boolean", options={"default":0})
    */
    protected $premium;
    
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

    /**
    * @ORM\ManyToOne(targetEntity="Candidat", inversedBy="projets")
    * @ORM\JoinColumn(name="candidat_id", referencedColumnName="id") 
    */
    protected $candidat_id;

    /**
    * @ORM\OneToMany(targetEntity="Langage", mappedBy="projet_id") 
    */
    protected $langages;

    protected $listlangages;

    public function __construct(){
        $this->langages = new ArrayCollection();
    }

    function getId() {
        return $this->id;
    }

    function getTitre() {
        return $this->titre;
    }

    function getPremium() {
        return $this->premium;
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

    function getListlangages() {
        return $this->listlangages;
    }

    function setId($id) {
        $this->id = $id;
    }

    function setTitre($titre) {
        $this->titre = $titre;
    }

    function setPremium($premium) {
        $this->premium = $premium;
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

    function setListlangages($listlangages) {
        $this->listlangages = $listlangages;
    }  
}