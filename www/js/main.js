var mainApp = angular.module("mainApp", ['ngRoute','ngStorage','ngAnimate','ngMessages','ngTouch','ngSanitize']);

mainApp.config(function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'views/home.html',
			controller: 'HomeController'
		})
		.when('/landing', {
			templateUrl: 'views/landingpage.html',
			controller: 'LandingController'
		})	
		.when('/signin', {
			templateUrl: 'views/signin.html',
			controller: 'SignInController'
		})
		.when('/signup', {
			templateUrl: 'views/signup.html',
			controller: 'SignUpController'
		})	
		.when('/dashboard', {
			templateUrl: 'views/dashboard.html',
			controller: 'DashboardController'
		})	
		.when('/createquest', {
			templateUrl: 'views/createquestions.html',
			controller: 'CreateQuestController'
		})
		.when('/myprofile', {
			templateUrl: 'views/myprofile.html',
			controller: 'MyProfileController'
		})
		.when('/view-profile/:id', {
			templateUrl: 'views/viewprofile.html',
			controller: 'ViewProfileController'
		})	
		.when('/questtome', {
			templateUrl: 'views/questiontome.html',
			controller: 'QuestionsToMeController'
		})	
		.when('/questtome-more', {
			templateUrl: 'views/questiontome-more.html',
			controller: 'QuestionsToMeMoreController'
		})	
		.when('/questfrom-me', {
			templateUrl: 'views/question-answer.html',
			controller: 'QuestionsFromMeController'
		})
		.when('/questfrom-groups', {
			templateUrl: 'views/questionfrom-groups.html',
			controller: 'QuestionsFromGroupsController'
		})
		.when('/followers', {
			templateUrl: 'views/followers.html',
			controller: 'FollowersController'
		})
		.when('/user-followers', {
			templateUrl: 'views/user-followers.html',
			controller: 'UserFollowersController'
		})
		.when('/contacts', {
			templateUrl: 'views/contacts.html',
			controller: 'ContactsController'
		})	
		.when('/answer-question/:id/:id2?', {
			templateUrl: 'views/answer-question.html',
			controller: 'answerQuestController'
		})
		.when('/get-user-question-list/:id/:id2?', {
			templateUrl: 'views/get-user-question-list.html',
			controller: 'UserQuestController'
		})
		.when('/get-answered-questions', {
			templateUrl: 'views/get-answered-questions.html',
			controller: 'UserAnswerController'
		})
		.when('/previewquestion/:id', {
			templateUrl: 'views/previewquestion.html',
			controller: 'answerQuestController'
		})
		.when('/help', {
			templateUrl: 'views/help.html',
			controller: 'helpController'
		})
		.when('/response-details/:id', {
			templateUrl: 'views/response-details.html',
			controller: 'ResponseDeatilsController'
		})	
		.when('/reset-password', {
			templateUrl: 'views/resetpassword.html',
			controller: 'ResetPasswordController'
		})	
		.when('/change-password', {
			templateUrl: 'views/changepassword.html',
			controller: 'ChangePasswordController'
		})	
		.when('/terms', {
			templateUrl: 'views/terms.html',
			controller: 'ChangePasswordController'
		})	
		.when('/privacy', {
			templateUrl: 'views/privacy.html',
			controller: 'ChangePasswordController'
		})		
		.otherwise({
			redirectTo: '/home'
		});
});
mainApp.run(function($rootScope,$timeout,$location,$interval,$localStorage,sharedProperties,$http,$window,$route) {
	
	$rootScope.$on('$routeChangeStart', function() {
		var spinner = $rootScope.showLoader();
	});
	$rootScope.$on('$routeChangeSuccess', function() {	
			
	});
	$rootScope.logout  = function() {
		$localStorage.$reset();
		$rootScope.changePage('home');
	}
	$rootScope.changePage  = function(path) {
		$location.path(path);
	}
	$rootScope.clearSharedData = function (){
		var data ={};
		sharedProperties.setProperty(data);
	}
	
	$rootScope.showAlert = function(title,content,button) {
	    swal({
	      title: title,
	      text: content,
	      confirmButtonColor: "#133656",
	      confirmButtonText: button
	    });
	  };
    $rootScope.showConfirm = function(title,text,bttontext,type,id){
    	swal({
    	  title: title,
    	  text: text,
    	  //type: "warning",
    	  showCancelButton: true,
    	  confirmButtonColor: "#DD6B55",
    	  confirmButtonText: bttontext,
    	  closeOnConfirm: false
    	},
    	function(){
    	$rootScope.softDeleteRecord(id,type);
    	  //swal("Deleted!", "Your imaginary file has been deleted.", "success");
    	});
    }
    $rootScope.showDeleteConfirm = function(title,text,bttontext,fnConfirmed,fnCancelled){
    	swal({
    	  title: title,
    	  text: text,
    	  //type: "warning",
    	  showCancelButton: true,
    	  confirmButtonColor: "#DD6B55",
    	  confirmButtonText: bttontext,
    	  closeOnConfirm: true
    	},
    	function(pressedButton){
    		if(pressedButton){
    			fnConfirmed();
    		}
    	});
    }

    $rootScope.showPrompt = function(title,text,placeHolderText,inputValue,bttontext,fnSave,fnCancelled){
    	swal({
    	  	title: title,
    	  	text: text,
    	  	inputPlaceholder: placeHolderText,
    	  	type: "input",
    	  	inputValue: inputValue,
    	  	showCancelButton: true,
    	  	confirmButtonText: bttontext,
    	  	closeOnConfirm: true
    	},
    	function(inputText){
    		if(inputText){
    			fnSave(inputText);
    		}
    	});
    }

    $rootScope.showAlertWithShareBtn = function(title,content,button,messageToShare) {
	    swal({
	      title: title,
	      text: content,
	      showCancelButton: true,
	      confirmButtonColor: "#C1C1C1",
	      confirmButtonText: "Share!",
          cancelButtonText: button
	    },
    	function(isSharedBtnPressed){
    		if(isSharedBtnPressed){
    			$rootScope.shareApp(messageToShare, 'http://quarktest.socializer.io/images/profilePhoto.png', 'https://www.decidable.co/downloadnow');
    		}
    	});
	};

    $rootScope.changeServerUrl  = function() {
    	$rootScope.showPrompt("Change Server API URL", "New url:", "Enter new url here", apiUrl, "Save",function(apiNewUrl){ // Delete button pressed
			localStorage.setItem("apiUrl", apiNewUrl);
    		window.location.reload();
		},function(){// Cancel button pressed

		});
	};

	$rootScope.getPushNotificationToken  = function() {
		var pushToken = localStorage.getItem("pushToken");
		window.open('mailto:rajwebxprt@gmail.com?subject=pushtoken_quark_app&body=' + pushToken);
	};	

    $rootScope.goBack = function() {
    	if(typeof(goToHome) != 'undefined' && goToHome == true){
    		goToHome = false;
    		if(typeof cordova == "undefined"){
    			window.top.location.reload();
    			return;
    		}
    		window.location = "#/dashboard";
    		return;
    	}
      	window.history.back();

    };

    $rootScope.showLoader = function(){    	
    	var opts = {
    	  lines: 17 // The number of lines to draw
    	, length: 35 // The length of each line
    	, width: 6 // The line thickness
    	, radius: 33 // The radius of the inner circle
    	, scale: 0.50 // Scales overall size of the spinner
    	, corners: 1 // Corner roundness (0..1)
    	, color: '#000' // #rgb or #rrggbb or array of colors
    	, opacity: 0.25 // Opacity of the lines
    	, rotate: 0 // The rotation offset
    	, direction: 1 // 1: clockwise, -1: counterclockwise
    	, speed: 1 // Rounds per second
    	, trail: 60 // Afterglow percentage
    	, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    	, zIndex: 2e9 // The z-index (defaults to 2000000000)
    	, className: 'spinner' // The CSS class to assign to the spinner
    	, top: '50%' // Top position relative to parent
    	, left: '50%' // Left position relative to parent
    	, shadow: false // Whether to render a shadow
    	, hwaccel: false // Whether to use hardware acceleration
    	, position: 'absolute' // Element positioning
    	}
    	var target = document.getElementById('ngview');
    	var spinner = new Spinner(opts).spin(target);
    	return spinner;
    };


    $rootScope.deleteQuestion = function(){
		$rootScope.showDeleteConfirm("Delete Question", "Are you sure?", "Delete",function(){ // Delete button pressed
			var spinner = $rootScope.showLoader();
			var data={
				'user_id':$localStorage.user.id,
				'question_id':$route.current.params.id
			}

			$http.post(apiUrl+'delete-question/' + $route.current.params.id + "/" + $localStorage.user.id, data).then(function successCallback(response){
				spinner.stop();
				if(response.data.status == 'success')
				{				
					$rootScope.showAlert('Success','Question Deleted!','OK');
					$rootScope.goBack();
	          		//$rootScope.changePage('dashboard');
				}
				else if(response.data.status == 'error'){
					spinner.stop();
				}
			}, function errorCallback(response){
					spinner.stop();
			});	
		},function(){// Cancel button pressed

		});
	};

	$rootScope.shareApp = function(message, imageUrl, url) {
		if(typeof(cordova) != "undefined"){
			var options = {
				message: message, // not supported on some apps (Facebook, Instagram)
				//subject: 'Please download Decidable app from link given', // fi. for email
				files: [imageUrl], // an array of filenames either locally or remotely
				url: url,
				chooserTitle: 'Pick an app to share' // Android only, you can override the default share sheet title,
				//appPackageName: 'com.apple.social.facebook' // Android only, you can provide id of the App you want to share with
			};

			var onSuccess = function(result) {
				console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
				console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
			};

			var onError = function(msg) {
				console.log("Sharing failed with message: " + msg);
			};

			window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
		}
	};

	$rootScope.followUserOne = function(currentUserId){
	    if(localStorage.getItem("followUserOneBy" + currentUserId) == null){
	        // Add user with user id 1
	        $http.post(apiUrl+'add-contact/'+currentUserId+'/1').then(function successCallback(response){
	            // Follow user with user id 1
	            $http.post(apiUrl+'follow-contact/'+currentUserId+'/1').then(function successCallback(response){
	                localStorage.setItem("followUserOneBy" + currentUserId, "true");
	            }, function errorCallback(response){

	            });
	        }, function errorCallback(response){

	        });
	    }
	};

	$rootScope.showLandingPage = function(){
	    if(localStorage.getItem("showLandingPage") == null){
			localStorage.setItem("showLandingPage", "false");
			document.location = "#landing";
			//$rootScope.changePage('landing');
	    }
	    else{
	    	document.location = "#dashboard";
	    	//$rootScope.changePage('dashboard');
	    }
	};

	$rootScope.showActionSheet = function( userId, questionId, userName, questionDetails){

		console.log(userId);

		console.log(userName);

		console.log(questionDetails);
		//
		var userObj = localStorage.getItem("ngStorage-user");
		var loggedInUserId = "";
		var showFollowing = false;
		var isFollowing = false;

		if(userName !== "Anonymous" && userName !== "Me" ){
			showFollowing = true;
		}

		if(userObj){
			loggedInUserId = JSON.parse(userObj).id;
		}

		if(!loggedInUserId){
			return;
		}

		var spinner = $rootScope.showLoader();
		$http.get(apiUrl + "get-user-question-list/" + loggedInUserId + "/" + userId).then(function successCallback(response){
					
		spinner.stop();
		if(response.data.status == 'success')
		{
			if(response.data && response.data.owner_object && response.data.owner_object.following === "true"){
				isFollowing = true;
			}


			var optionsList = ["Share", "Hide Post", "Report User"];
			if(showFollowing){
				if(isFollowing){
					optionsList.push("Unfollow User");
				}
				else{
					optionsList.push("Follow User");
				}
			}	


		    mcxDialog.showBottom({
			  btn: optionsList,
			  btnColor: ["#000000", "#000000"],
			  btnClick: function(index){
			    alert("You Just Clicked " + (index ));
			    alert("Typeof index: " + (typeof index));
			    if(index === '1'){
			    	$rootScope.shareApp( questionDetails + " Answer with me on Decodable!", 'http://quarktest.socializer.io/images/profilePhoto.png', 'https://www.decidable.co/downloadnow');
			    }

			    if(index === '2'){
			    	var postIds = localStorage.getItem("hidePostIds");
			    	if(postIds === null){
			    		postIds = [];
			    	}
			    	else {
			    		postIds = postIds.split(",");
			    	}
			    	postIds.push("" + questionId);
			    	localStorage.setItem("hidePostIds", postIds.toString());
			    	window.location.reload();
			    }

			    if(index === '3'){
			    	alert("In option 3");
			    	var htmlBody = "Hello Decidable Privacy Team," +
			    					"\n\nI would like to report the following user for removal." +
			    					"\n\nUser Details: " + 
			    					"\nUsername:" + userName +
			    					"\nUser Id: " + userId + 
			    					"\n\nQuestion Details: " + 
			    					"\nQuestion: " + questionDetails + 
			    					"\nQuestion Id: " + questionId + 
			    					"\n\n\nThank you!";

			    	alert("After htmlBody");
			    	
			    	if(typeof cordova === "undefined"){
			    		alert("In cordova if");
			    		htmlBody = encodeURIComponent(htmlBody);
			    		window.location.href = 'mailto:hello@socializer.io?subject=Inappropriate User&body=' + htmlBody;
			    	}
			    	else{
			    		alert("In cordova else");
			    		alert("htmlBody: " + htmlBody);
				    	cordova.plugins.email.open({
						    //from:       String, // sending email account (iOS only)
						    to:          'hello@socializer.io', // email addresses for TO field
						    //cc:          Array, // email addresses for CC field
						    //bcc:         Array, // email addresses for BCC field
						    //attachments: Array, // file paths or base64 data streams
						    subject:    'Inappropriate User', // subject of the email
						    body:       htmlBody, // email body
						    isHtml:    false  // indicats if the body is HTML or plain text (primarily iOS)
						});
						alert("after email open");
					}
					alert("end of option 3")
			    	//window.open('mailto:hello@socializer.io?subject=Inappropriate User&body=' + htmlBody);

			    }

			    if(index === '4'){
			    	$rootScope.addUserToContact(userId, isFollowing);
			    	//$rootScope.followUnfollowUser(userId, isFollowing);
			    }

			  }
			});

	  		}
	  		
	  	}, function errorCallback(response){
	  		spinner.stop();	
	  	});
		  

	};

	$rootScope.filterHideQuestions = function(questions){
		var qArr = [];
		var postIds = localStorage.getItem("hidePostIds");
    	if(postIds === null || (postIds && postIds.length && postIds.length <= 0 )){
    		return questions;
    	}
    	else {
    		postIds = postIds.split(",");
    	}
		questions.forEach(function(question, index){
			if(postIds.indexOf(question.id.toString()) <= -1){
				qArr.push(question);
			}
		});
		return qArr;
	};

	$rootScope.followUnfollowUser = function( userId, isFollowing){
		var userObj = localStorage.getItem("ngStorage-user");
		var loggedInUserId = "";

		if(userObj){
			loggedInUserId = JSON.parse(userObj).id;
		}

		if(!loggedInUserId){
			return;
		}
		var followUnfollowApi = "";
		if(isFollowing){
			followUnfollowApi = "unfollow-contact";
		}
		else{
			followUnfollowApi = "follow-contact";
		}

		

		var spinner = $rootScope.showLoader();
		$http.post(apiUrl + followUnfollowApi +'/'+loggedInUserId+'/'+userId).then(function successCallback(response){
			spinner.stop();
			window.location.reload();
		}, function errorCallback(response){
			spinner.stop();
		});  

	};

	$rootScope.addUserToContact = function( userId, isFollowing){
		var userObj = localStorage.getItem("ngStorage-user");
		var loggedInUserId = "";

		if(userObj){
			loggedInUserId = JSON.parse(userObj).id;
		}

		if(!loggedInUserId){
			return;
		}		

		var spinner = $rootScope.showLoader();
		$http.post(apiUrl +'add-contact/'+loggedInUserId+'/'+userId).then(function successCallback(response){
			spinner.stop();
			$rootScope.followUnfollowUser(userId, isFollowing);
		}, function errorCallback(response){
			spinner.stop();
		});  

	};


});
