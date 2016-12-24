$(function(){

    $(".banner-slider").slick({
        arrows:false,
        dots:true
    });
    $(".chosen-select").chosen({disable_search_threshold: 10}).change(function(){
		$(this).removeClass("error");
	});
	$("#age-slider").slider({
      range: "max",
      min: 20,
      max: 60,
      slide: function( event, ui ) {
        $( ".slider-values span:first-child" ).html( ui.value );
		$( "#age" ).val( ui.value );
      }
    });
    $("#age" ).val( $( "#age-slider" ).slider( "value" ) );
	$("#interests").tagit({afterTagAdded: function(event, ui) {
        	$(".tags").append(ui.tag);
	}});
	$("[name=address]").change(function(){
		var val = $(this).val();
		var addresstype = $("#"+val); 
		$(".address-type").hide();
		addresstype.show();
	});
	$("#avatar-1").fileinput({
		overwriteInitial: true,
		maxFileSize: 200,
		maxImageWidth:310,
		maxImageHeight:325,
		showClose: false,
		showCaption: false,
		browseLabel: 'upload your photo',
		removeLabel: '',
		browseIcon: '',
		removeIcon: '',
		removeTitle: 'Cancel or reset changes',
		defaultPreviewContent: '<img src="images/img-profile-pic.jpg" alt="Your Avatar">',
		layoutTemplates: {main2: '{preview} {remove} {browse}'},
		allowedFileExtensions: ["jpg", "png", "gif"]
	});
	$("#avatar-2").fileinput({
		overwriteInitial: true,
		maxFileSize: 200,
		maxImageWidth:310,
		maxImageHeight:325,
		showClose: false,
		showCaption: false,
		browseLabel: 'test',
		removeLabel: '',
		browseIcon: '',
		removeIcon: '',
		removeTitle: 'Cancel or reset changes',
		defaultPreviewContent: '<img src="'+init.getimage()+'" alt="Your Avatar">',
		layoutTemplates: {main2: '{preview} {remove} {browse}'},
		allowedFileExtensions: ["jpg", "png", "gif"]
	});
	$(".profile-pic").on("click",".kv-fileinput-error .close",function(){
		$(this).closest(".file-preview").next(".fileinput-remove").trigger("click");
		console.log("test");
	});
	$("[name=firstname]").keyup(function(){
		var val = $(this).val();
		if(/[^A-Za-z]/.test(val)) {
			$(this).val(val.substr(0,val.length-1));
		}
	});
	$("#registeruser").click(function(){
		$.validator.setDefaults({ ignore: ":hidden:not(select)" });
		init.create($("#registerform"),$("#register-modal"),$(".profile-pic"));
	});
	$('#register-modal').on('hidden.bs.modal', function (e) {
		init.reset($("#registerform"));
	});
	$('#update-modal').on('shown.bs.modal', function (e) {
		init.editprofile($("#update-user"));
	});
	$("#updateuser").click(function(){
		$.validator.setDefaults({ ignore: ":hidden:not(select)" });
		init.create($("#update-user"),$("#update-modal"),$(".profile-pic.edit-photo"));
	});
});

var validation = (function(){
	function validate(form) {
		var form = form;
		form.validate({
			rules:{
			phoneno:{
				required:true,
				number:true
			},
			email:{
				required:true,
				email:true
			}
			}
		});
		return form.valid();
	}
	function reset(form) {
		form.find("input,select").val("");
		form.find("input[type=checkbox]").prop("checked","");
		form.find(".chosen-select").trigger("chosen:updated");
		form.find(".fileinput-remove").trigger("click");
	}
	return {
		validate:validate,
		reset:reset
	}
})();

var buildobject = (function(){
	function getvalidation(form) {
		return validation.validate(form);
	}
	function createuser(form,modal,profileimage) {
		if((getvalidation(form) && !localStorage.getItem("user")) || (getvalidation(form) && localStorage.getItem("user"))) {
			window.localStorage.removeItem("user");
			var user = {};
			var form = form;
			var addrtype = form.find("[name=address]").val();
			var addr1 = $("#"+addrtype).find("[name="+addrtype+"addr1]").val();
			var addr2 = $("#"+addrtype).find("[name="+addrtype+"addr2]").val();;
			var interests = [];
			var tags = form.find(".tags li");
			$.each(tags,function(i,el){
				var tag = $(el);
				interests[i] = tag.find(".tagit-label").text();
			});
			var image = profileimage.find(".file-preview-image").length > 0 ? profileimage.find(".file-preview-image").attr("src"):"images/img-profile-pic.jpg";
			user["image"] = image;
			user["firstname"] = form.find("[name=firstname]").val();
			user["lastname"] = form.find("[name=lastname]").val();
			user["email"] = form.find("[name=email]").val();
			user["phone"] = form.find("[name=phoneno]").val();
			user["age"] = form.find("[name=age]").val();
			user["state"] = form.find("[name=state]").val();
			user["country"] = form.find("[name=country]").val();
			user["address"] = {};
			user["address"]["type"] = addrtype;
			user["address"]["address1"] = addr1;
			user["address"]["address2"] = addr2;
			user["interests"] = interests;
			user["subscribe"] = form.find("[name=subscription]").is(":checked");
			localStorage.setItem("user",JSON.stringify(user));
			modal.modal("hide");
			if(window.location.pathname.indexOf("profile.html") < 0) {
				window.location.href = "profile.html";
			}
			else {
				init.load();
			}
		}
		else {
			return;
		}
	}
	return {
		create:createuser
	}
})();

var profile = (function(){
	function getprofiledata() {
		return JSON.parse(localStorage.getItem("user"));
	}
	function getimage() {
		if(localStorage.getItem("user")) {
			return JSON.parse(localStorage.getItem("user")).image;
		}
	}
	function editprofile(form) {
		if(window.location.pathname.indexOf("profile.html") > -1) {
			if(localStorage.getItem("user")) {
				var userprofile = getprofiledata();
				form.find("[name=firstname]").val(userprofile.firstname);
				form.find("[name=lastname]").val(userprofile.lastname);
				form.find("[name=email]").val(userprofile.email);
				form.find("[name=state]").val(userprofile.state);
				form.find("[name=phoneno]").val(userprofile.phone);
				form.find("[name=country]").val(userprofile.country);
				form.find("[name=address]").val(userprofile.address.type);
				form.find("#"+userprofile.address.type).show();
				form.find("[name="+userprofile.address.type+"addr1]").val(userprofile.address.address1);
				form.find("[name="+userprofile.address.type+"addr2]").val(userprofile.address.address1);
				form.find("[name=subscription]").prop("checked",userprofile.subscribe);
				form.find(".chosen-select").trigger("chosen:updated");
				form.find("#interests-loaded").val(userprofile.interests.join(",")).tagit({afterTagAdded: function(event, ui) {
					$(".tags").append(ui.tag);
				}});
				setage(form);		
			}
		}
	}
	function setage(form) {
		var userprofile = getprofiledata();
		var age = parseInt(userprofile.age);
		var slider = form.find("#age-slider");
		var input = form.find("#age");
		slider.slider({
			range: "max",
			min: 20,
			max: 60,
			slide: function( event, ui ) {
				form.find( ".slider-values span:first-child" ).html( ui.value );
				input.val( ui.value );
			}
		}).slider( "option", "value", age);
		input.val(slider.slider( "value" ) );
	}
	function loadprofile() {
		if(window.location.pathname.indexOf("profile.html") > -1) {
			if(localStorage.getItem("user")) {
				var userprofile = getprofiledata();
				var name = userprofile.firstname +" "+ userprofile.lastname;
				var age = userprofile.age;
				var email = userprofile.email;
				var state = userprofile.state;
				var interests = userprofile.interests;
				var phoneno = userprofile.phone;
				var subscription = userprofile.subscribe;
				var interesthtml = "I like to ";
				var subscriptionhtml = "And please send me newsletters.";
				if(interests.length > 0) {
					if(interests.length == 1) {
						interesthtml += interests[0];
					}
					else if(interests.length == 2) {
						interesthtml += interests.join(" and ");
					}
					else {
						interesthtml += interests.slice(0,interests.length-1).join(", ");
						interesthtml += " and "+interests[interests.length-1];
					}
				}
				else {
					interesthtml = "";
				}
				if(!subscription){
					subscriptionhtml = "";
				}
				var htmlstring = "<p>I'm "+name+" and I'm above "+age+" years and you can send your emails to \
				<a class='pm-color' href='mailto:"+email+"'>"+email+"</a>. I live in the state of "+state+". \
				"+interesthtml+". "+subscriptionhtml+" Please reach \
				out to me on my phone "+phoneno+".\
				</p>";
				$(".profile-content").html(htmlstring);
			}
			else {
				window.location.href = "index.html";
			}
		}
	}
	return {
		load:loadprofile,
		profileimage:getimage,
		editprofile:editprofile
	}
})();

var init = (function(){
	return {
		create:buildobject.create,
		reset:validation.reset,
		load:profile.load,
		getimage:profile.profileimage,
		editprofile:profile.editprofile
	}
})();
init.load();
