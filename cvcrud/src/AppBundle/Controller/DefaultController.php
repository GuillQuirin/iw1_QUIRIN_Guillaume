<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use AppBundle\Entity\Candidat;
use AppBundle\Entity\Projet;
use AppBundle\Entity\Langage;

use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $array = [];
        $id = 1;
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);

        $em = $this->getDoctrine()->getManager();
        $connection = $em->getConnection();
       
        //Candidat
        $statement = $connection->prepare("SELECT * FROM candidat WHERE id=:id");
        $statement->bindValue('id', $id);
        $statement->execute();
        $array['candidat'] = $statement->fetch();

        //Projets
        $statement = $connection->prepare("SELECT * FROM projet WHERE candidat_id=:id");
        $statement->bindValue('id', $id);
        $statement->execute();
        $array['projects'] = $statement->fetchAll();

        //Langages
        foreach ($array['projects'] as $key => $projet) {
            $statement = $connection->prepare("SELECT * FROM langage WHERE projet_id=:projet");
            $statement->bindValue('projet', $projet['id']);
            $statement->execute();
            $array['projects'][$key]['langages'] = $statement->fetchAll();
        }     

        return new Response($serializer->serialize($array,'json'));
    }
}
