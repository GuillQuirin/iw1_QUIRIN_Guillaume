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

class Participations{

	/**
    * @ORM\Column(type="integer")
    * @ORM\Id
    * @ORM\GeneratedValue(strategy="AUTO")
    */
    protected $id;

    /**
    * @ORM\ManyToOne(targetEntity="Association", inversedBy="participations")
    * @ORM\JoinColumn(name="association_id", referencedColumnName="id") 
    */
    public $association_id;

    /**
    * @ORM\ManyToOne(targetEntity="User", inversedBy="participations")
    * @ORM\JoinColumn(name="user_id", referencedColumnName="id") 
    */
    public $user_id;

    /**
    * @ORM\Column(type="datetime")
    */
	protected $date_crea;

    public function __construct()
    {
        $this->date_crea = new \DateTime();
    }

    public function getId(){return $this->id;}
    public function getAssociation_id(){return $this->association_id;}
    public function getUser_id(){return $this->user_id;}
	public function getDate_crea(){return $this->date_crea;}

    public function setId($id){$this->id = $id;}
    public function setAssociation_id($association_id){$this->association_id = $association_id;}
    public function setUser_id($user_id){$this->user_id = $user_id;}
	public function setDate_crea($date_crea){$this->date_crea = $date_crea;}
}