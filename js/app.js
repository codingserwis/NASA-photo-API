// Nasa Key - KxGtPU1p1pv7tJcH5VwhgvAkODPdT3SeDbkwtOp9
// *** NASA KEY ***
	var nasaKey = 'KxGtPU1p1pv7tJcH5VwhgvAkODPdT3SeDbkwtOp9';
$(()=>{
// *** URL for the APOD - API - Astronomy Picture of the Day by NASA ***
	function randomDate(){
		var rDate = '';
		function randomDay(){
			var rDay = Math.floor((Math.random() * 30) + 1);
				if(rDay === 0){
					return rDay + 1;
				} else {
					return rDay;
				}	
		}
		function randomMonth(){
			var rMonth = Math.floor((Math.random() * 12) +1);
			return rMonth;
		}
		rDate = randomMonth()+'-'+ randomDay();
		return rDate;
	}
	var apodAdr = `https://api.nasa.gov/planetary/apod?date=2016-${randomDate()}&api_key=${nasaKey}`;

// *** This function loads img from APOD as big background of section_one ***
	function getImg(img){
		var bigImgBg = $('.section_one');
			$.each(img, (index, value)=>{
				bigImgBg.css('background-image', 'url('+img.hdurl+')');
			});
	}
// *** This function loads img info from APOD to section_one ***
	function getImgInfo(imgTitle){
		var titleHeading = $('.img_title');
			$.each(imgTitle, (index, value)=>{
				titleHeading.text(`Image title: ${imgTitle.title}`);
			})
	}
// *** This function loads APOD API ***
	function loadPhotoApi(){
		$.ajax({
			url: apodAdr,
			dataType: 'json',
			type: 'GET'
		}).done((response)=>{
			getImg(response);
			getImgInfo(response);
		}).fail((error)=>{
			console.log(error);
		})
	}
// *** Function start ***
loadPhotoApi();
});
// *** Shows and hide list of Rovers ***
	function showHideList(){
		var listBox = $('.dropdown_list');
		
			listBox.on('click', (event)=>{
				$(event.currentTarget).children('ul').toggle('slow');
			});
	}

// *** This function loads Mars images ***
function getMarsImg(mImg){
		var photoList = $('#photos');
		$.each(mImg, function(index, value){
			$.each(this, function(subindex, subvalue){
				var li = $('<li>', {class: 'photo_list'}),
					cameraName = $('<p>' + this.camera.full_name + '</p>'),
					img = $('<img src="' + this.img_src +'"/>'),
					earthDate = $('<p>Earth date: ' + this.earth_date + '<p>'),
					solDate = $('<p>SOL: ' + this.sol + '<p>');

				li.append(cameraName);
				li.append(img);
				li.append(earthDate);
				li.append(solDate);
				$('#photos').append(li);
			});
		});		
	}
// *** This function loads main info about chosen rover ***
	function getManifest(roverInfo){
		var rInfo = $('#rover_info');
		$.each(roverInfo, function(index, value){
			rInfo.empty();
			var li = $('<li>'),
				rName = $(`<p>Rover name: ${roverInfo.photo_manifest.name}</p>`),
				rLunchDate = $(`<p>Lunched from Earth: ${roverInfo.photo_manifest.launch_date}</p>`),
				rLandingDate = $(`<p>Landed on Mars: ${roverInfo.photo_manifest.landing_date}</p>`),
				rStatus = $(`<p>Rover status: ${roverInfo.photo_manifest.status}</p>`),
				rMaxEDate = $(`<p>Max earth date: ${roverInfo.photo_manifest.max_date}</p>`),
				rMaxSDate = $(`<p>Max SOL date: ${roverInfo.photo_manifest.max_sol}</p>`),
				rTotalPhotos =$(`<p>${roverInfo.photo_manifest.name} made: ${roverInfo.photo_manifest.total_photos} photos</p>`);
		
			li.append(rName, rLunchDate, rLandingDate, rStatus, rMaxEDate, rMaxSDate, rTotalPhotos);
			rInfo.append(li);
			rangeBar(roverInfo);
		});
	}
// *** This funtion loads range bar to chose sol day ***
	function rangeBar(roverInfo){
		var solDate = $('#sol_date');
	
			$.each(roverInfo, function(index, value){
				var li = $('<li>'),
					desc =$('<p class="sol_bar">Move bar to choose SOL day</p>'),
					solSelector = $(`<input id="sol_day" type="range" step="1" name="sol_selector" min="0" max="${roverInfo.photo_manifest.max_sol}">`);
				
				li.append(desc);
				li.append(solSelector);
				solDate.append(li);

				chosenSolDay(roverInfo);
			});
	}
	
// *** This function loads info about number of photos and cameras from chosen SOL day ***
	function chosenSolDay(roverInfo, chosenRover){
		var solDay = $('input#sol_day');
		
			solDay.on('change', function(){
				var chosenRover = roverInfo.photo_manifest.name,
					pickedSolDay = ($(this).val()),
					cameraAndPhotoInfo = $('#camera_and_photo_info'),
					li = $('<li>'),
					photoNoInfo = $(`<p>In SOL: ${pickedSolDay} ${roverInfo.photo_manifest.name} made: ${roverInfo.photo_manifest.photos[pickedSolDay].total_photos} photos</p>`);
					cameraAndPhotoInfo.empty();
					
					li.append(photoNoInfo);
					cameraAndPhotoInfo.append(li);
					$('#photos').empty();
					loadMarsApi(pickedSolDay, chosenRover);
			});
	}

// *** This function gets chosen Rover and put thiv var in the url to MARS ROVER PHOTOS API ***
// *** to get MISSION MANIFEST - more info about Rover and photos***
	function selectedElem(){
		var listValue = $('.list_panel').children();
			listValue.each(function(index, value){
				$(this).on('click', function(){
					var chosenRover = ($(this).data('value'));
					$('#rover_info').empty();
					$('#sol_date').empty();
					$('#camera_and_photo_info').empty();
					$('#photos').empty();
					loadManiInfo(chosenRover);
				});
			});
	}
// *** Conection to the Manifest API
	function loadManiInfo(chosenRover){
		var mrpManiUrl = `https://api.nasa.gov/mars-photos/api/v1/manifests/${chosenRover}?&api_key=${nasaKey}`;
		$.ajax({
			url: mrpManiUrl,
			//"https://api.nasa.gov/mars-photos/api/v1/rovers/"+chosenRover+"/photos?sol=100&api_key=DEMO_KEY",
			//mrpManiUrl,
			dataType: 'json',
			type: 'GET'
		}).done(function(response){
			getManifest(response);
		}).fail(function(error){
			console.log(error);
		})
	}
// *** This function cennects to the Photo API ***
	function loadMarsApi(pickedSolDay, chosenRover){
		var marsPhotoApi = `https://api.nasa.gov/mars-photos/api/v1/rovers/${chosenRover}/photos?sol=${pickedSolDay}&api_key=${nasaKey}`;
		$.ajax({
			url: marsPhotoApi,
			dataType: 'json',
			type: 'GET'
		}).done(function(response){
			getMarsImg(response);
		}).fail(function(error){
			console.log(error);
		})
	}

// *** Slide down function ***
	function slideDown(){
		var link = $('#to_galery');

			link.each(function(){
				var pos = 0,
					elem = '';

				$(this).on('click', ()=>{
					elem=($(this).attr('href'));
					pos = $(elem).offset().top;
					$('body').animate({
						scrollTop: pos
					}, 1500);
				});
			});
	}
$(document).ready(function(){
	slideDown()
	showHideList();
	selectedElem();
});