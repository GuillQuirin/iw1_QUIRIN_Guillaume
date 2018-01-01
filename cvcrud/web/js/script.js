$(document).ready(function(){
	if($("#messages").find(".flash-notice").length!=0 || $("#messages").find(".flash-error").length!=0)
		$("#messages").addClass('active');
	
	$("#messages.active").click(function(event){
		if($(event.target).is("div.flash-notice")){
			//
		}
		else{
			$(".flash-notice").fadeOut();
			$(this).fadeOut();
		}
	});


	//Confirmation de suppression de l'élement
	$('.glyphicon-trash').click(function(event){
		return confirm("Souhaitez-vous vraiment supprimer cette ligne ?");
	});

	//DataTables
	$('.datatable_esgi').each(function(){
		$(this).DataTable( {
	        "order": [[ 1, "desc" ]],
	        "language": {
	            "lengthMenu": "Affichage de _MENU_ lignes par page",
	            "zeroRecords": "Aucun résultat trouvé",
	            "info": "Page n° _PAGE_ sur _PAGES_",
	            "infoEmpty": "Pas de résultat trouvé",
	            "infoFiltered": "(filtre sur un total de _MAX_ lignes)",
	            "search": "Rechercher",
	            "paginate": {
	            	"previous": "Precedent",
	            	"next": "Suivant"
	            }
	        }
	    });
	});
});
$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').focus()
})