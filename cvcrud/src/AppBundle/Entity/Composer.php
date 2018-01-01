<?php 
namespace AppBundle\Entity;

use Symfony\Component\Validator\Mapping\ClassMetadata;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Type;
use Symfony\Component\Security\Core\User\UserInterface;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ParticipationsRepository")
 * @ORM\Table(name="participations")
 */

class Composer{

	/**
    * @ORM\Column(type="integer")
    * @ORM\Id
    * @ORM\GeneratedValue(strategy="AUTO")
    */
    protected $id;

    /**
    * @ORM\ManyToOne(targetEntity="Projet", inversedBy="Composer")
    * @ORM\JoinColumn(name="projet_id", referencedColumnName="id") 
    */
    public $projet_id;

    /**
    * @ORM\ManyToOne(targetEntity="Langage", inversedBy="Composer")
    * @ORM\JoinColumn(name="langage_id", referencedColumnName="id") 
    */
    public $langage_id;

  

    public function __construct()
    {
    }

    function getId() {
        return $this->id;
    }

    function getProjet_id() {
        return $this->projet_id;
    }

    function getLangage_id() {
        return $this->langage_id;
    }

    function setId($id) {
        $this->id = $id;
    }

    function setProjet_id($projet_id) {
        $this->projet_id = $projet_id;
    }

    function setLangage_id($langage_id) {
        $this->langage_id = $langage_id;
    }


}