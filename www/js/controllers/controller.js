mainApp.controller('HomeController', function($scope,$rootScope,$http,$localStorage,sharedProperties) {
	if($localStorage.user)
	{
		$rootScope.changePage('dashboard');
	}
	
});
mainApp.controller('LandingController', function($scope,$rootScope,$http,$localStorage,sharedProperties) {
	console.log("=-=-=-=-=-=-=-=-=-=-")
	console.log(window.screen.height);
	var winHeight = window.screen.height;
	var winWidth = window.screen.width

	$scope.isPhone = true;
	if(typeof cordova === "undefined"){
		winHeight = 700;
		winWidth = 380;
		$scope.isPhone = false;
			
	}

	$(".landingPageImages").height((winHeight - 150) + "px");
	$(".landingPageContainer").height((winHeight) + "px");
	$(".landingPageContainer").width((winWidth) + "px");
	
	setTimeout(function(){
		$(".regular").slick({
	        dots: true,
	        infinite: false,
	        slidesToShow: 1,
	        slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 2000
	    });
	}, 1000);

    setTimeout(function(){
		document.location = "#dashboard";
    }, 13000);
	
});
mainApp.controller('DashboardController', function($scope,$rootScope,$http,$localStorage,sharedProperties) {

	var slideLeft = new Menu({
		wrapper: '#o-wrapper',
		type: 'slide-left',
		menuOpenerClass: '.c-button',
		maskId: '#c-mask'
	});
	goToHome = false;
	$scope.page = 0;

	$scope.showChangeServer = false;
	$scope.isPhone = false;
	if(typeof cordova !== "undefined"){
		$scope.isPhone = true;	
	}
	var spinner = $rootScope.showLoader();
		$http.get(apiUrl+'get-user/'+$localStorage.user.id).then(function successCallback(response){
		  	if(localStorage.getItem("showApiChangeButton") == "true"){
    			$scope.showChangeServer = true;
    		}
		  	if(response.data.status == 'success')
		  	{
		  		$localStorage.user = response.data.user;
				$rootScope.user = $localStorage.user;
				$rootScope.userAvatar = response.data.avatar;
        		$rootScope.memberSince = response.data.member_since;

        		var adminUsers = [64, 74, 75, 76, 77, 83, 103];
        		if( response.data && response.data.user && response.data.user.id && adminUsers.includes(response.data.user.id)){
        			$scope.showChangeServer = true;
        			localStorage.setItem("showApiChangeButton", "true");
        		}

        		if(typeof(PushNotification) != "undefined"){
	        		var push = PushNotification.init({
			            android: {
			            	clearBadge: true,
			            	"icon": "icon",
			            	sound: true
			                //"senderID": response.data.push_sender_id,
			                //"forceShow": true
			            },
			            ios: {
			            	alert: true,
			            	sound: true,
			            	badge: true,
			            	clearBadge: true
			            }
			        });
	        	}

	            /*push.on('registration', function(deviceData) {
          		var dataDevice={
					'user_id':$localStorage.user.id,
					'deviceDataVar':deviceData.registrationId,
					'deviceType':deviceData.registrationType
				}
					//alert(deviceData.registrationId);

					$http.post(apiUrl+'add-device', dataDevice).then(function successCallback(response){
						//alert('success');
						//alert(response.status);
					}, function errorCallback(response){
						//alert(response.status);
					});	
	            });*/

				if(typeof(cordova) != "undefined"){
			        push.on('notification', function (data) {
						$rootScope.showAlert(data.title,data.message, 'Ok');
						//alert(JSON.stringify(data.additionalData));
						var deviceTokenId = data.additionalData.deviceToken;
						
						// Deep linking code start
						//$rootScope.showAlert(data.title,data.additionalData.type, 'Ok');
						//data.additionalData.pushType = "showDirectQ";
						if(data.additionalData.type){
							var questionId = 325;

							switch(data.additionalData.type){
								case "create_question":
									goToHome = true;
									var qId = data.additionalData.q_id;
									window.location = "#answer-question/" + qId + "/dashboard";
									break;
								case "answer_question":
									goToHome = true;
									var qId = data.additionalData.q_id;
									window.location = "#answer-question/" + qId + "/dashboard";
									//window.location = "#response-details/" + qId;
									//window.location = "#response-details/" + qId;
									break;
								case "expired_question":
									goToHome = true;
									var qId = data.additionalData.q_id;
									//window.location = "#questfrom-me";
									window.location = "#response-details/" + qId;
									break;
							}
						}
						
						// Deep linking code end
						//alert(deviceTokenId);
						/*$http.post(apiUrl+'update-badge-notification/'+deviceTokenId).then(function successCallback(response){}, function errorCallback(response){});
						
						if(data.additionalData.foreground == false){
							if(data.additionalData.urlLink != ''){
								$rootScope.changePage(data.additionalData.urlLink);
							}
						}*/
						
					});
				}


        		//alert(response.data.user.temp_pwd);
        		if(response.data.user.temp_pwd == 1)
        		{
        			$rootScope.changePage('change-password');
        		}
		  	}
		  	else{						
		  		spinner.stop();	
		  	}
		  }, function errorCallback(response){
		  		if(localStorage.getItem("showApiChangeButton") == "true"){
        			$scope.showChangeServer = true;
        		}
		  		spinner.stop();	
		  });

			$http.get(apiUrl+'get-categories/'+$localStorage.user.id).then(function successCallback(response){
		  	
			  	if(response.data.status == 'success')
			  	{
			  		$scope.categories = response.data.categories;
			  		$scope.category = response.data.selected;
			  	}
			  	else{						
			  		spinner.stop();	
			  	}
		  	}, function errorCallback(response){
		  		spinner.stop();	
		  	});

			//$http.get(apiUrl+'get-dashboard-data/-1/'+$localStorage.user.id+'/'+$scope.page).then(function successCallback(response){
			$http.get(apiUrl+'get-followings-questions/'+$localStorage.user.id+'/-1/'+$scope.page).then(function successCallback(response){
				if(response.data.status == 'success')
				{
					spinner.stop();
					$scope.questions = response.data.questions;
					$scope.page = parseInt(response.data.page) + 1;
					$scope.categoryId = 0;
					$scope.userId = $localStorage.user.id;

					$scope.questions = $rootScope.filterHideQuestions($scope.questions);

					if(response.data.questions.length == 0){
						$scope.noData = true;
					}
					else{
						$scope.noData = false;
					}

					if(response.data.questions.length == 0 || response.data.questions.length < 5){
						$scope.loadMoreButton = true;
					}
					else{
						$scope.loadMoreButton = false;
					}
					setTimeout(function(){
						$scope.getCountBadge();
					}, 1000);

					for (var i = 0; i < $scope.questions.length; i++) {
						$scope.questions[i].timeCountDown = getTimeCountDown($scope.questions[i].due_date);
					}

				}
				else{						
					spinner.stop();	
				}
			}, function errorCallback(response){
				spinner.stop();	
			});

		$scope.showDirectQ = function(questionId){
			//$rootScope.showAlert("" + questionId,'Ok4');
			//var path = "answer-question/" + questionId + "/dashboard";
			//$rootScope.changePage(path);
			setTimeout(function(){
				//$rootScope.showAlert("" + questionId,'Ok4');
				//$rootScope.changePage('createquest');
				//$rootScope.changePage('get-answered-questions');
				$location.path('/get-answered-questions').replace();
			    $scope.$apply();
			},5000);
		}

		$scope.questByCategory = function(categoryId){
			var selectedCategory = document.getElementsByClassName("selectedCategory");
			selectedCategory[0].className = selectedCategory[0].className.replace(" selectedCategory", "");
			if(selectedCategory[0]){
				selectedCategory[0].className = selectedCategory[0].className.replace("selectedCategory", "");
			}
			var currentCategory = document.getElementById("category"+categoryId);
			currentCategory.className = currentCategory.className + " selectedCategory";
        	$scope.page = 0;
        	$scope.loadMoreButton = false;
        	$scope.categoryId = categoryId;
        	var urlToCall = apiUrl+'get-dashboard-data/'+$scope.categoryId+'/'+$localStorage.user.id+'/'+$scope.page;
        	if($scope.categoryId == -1){
        		urlToCall = apiUrl+'get-followings-questions/'+$localStorage.user.id+'/-1/'+$scope.page;
        	}
		  	var spinner = $rootScope.showLoader();
  			//$http.get(apiUrl+'get-dashboard-data/'+categoryId+'/'+$localStorage.user.id+'/'+$scope.page).then(function successCallback(response){
			$http.get(urlToCall).then(function successCallback(response){
					$scope.userId = $localStorage.user.id;

					if(response.data.status == 'success')
					{
						if(response.data.questions.length == 0)
						{
							$scope.noData = true;
						}
						else{
							$scope.noData = false;
						}
		                if(response.data.questions.length == 0 || response.data.questions.length < 5)
		                {
		                  $scope.loadMoreButton = true;
		                }
		                else{
		                  $scope.loadMoreButton = false;
		                }
  			  			spinner.stop();	
  			  			$scope.questions = response.data.questions;
  			  			$scope.questions = $rootScope.filterHideQuestions($scope.questions);
               			$scope.page = parseInt(response.data.page) + 1;

               			for (var i = 0; i < $scope.questions.length; i++) {
							$scope.questions[i].timeCountDown = getTimeCountDown($scope.questions[i].due_date);
						}

  			  		}
  			  		else{						
  			  			spinner.stop();	
  			  		}
  			  	}, function errorCallback(response){
  			  		spinner.stop();	
  			  });
		  }
      	$scope.loadMore = function(){
          	var spinner = $rootScope.showLoader();
          	var urlToCall = apiUrl+'get-dashboard-data/'+$scope.categoryId+'/'+$localStorage.user.id+'/'+$scope.page;
        	if($scope.categoryId == -1){
        		urlToCall = apiUrl+'get-followings-questions/'+$localStorage.user.id+'/'+0+'/'+$scope.page;
        	}
          	//$http.get(apiUrl+'get-dashboard-data/'+$scope.categoryId+'/'+$localStorage.user.id+'/'+$scope.page).then(function successCallback(response){
          	$http.get(urlToCall).then(function successCallback(response){
                if(response.data.status == 'success')
                {
                  spinner.stop(); 
                  //alert(response.data.questions.length);
                  if(response.data.questions.length == 0 || response.data.questions.length < 5)
                  {
                    $scope.loadMoreButton = true;
                  }
                  for (var key in response.data.questions) {
                    if (response.data.questions.hasOwnProperty(key)) {
                      	//console.log(key + " -> " + response.data.questions[key]);
						response.data.questions[key].timeCountDown = getTimeCountDown(response.data.questions[key].due_date);
                      	$scope.questions.push(response.data.questions[key]);
                    }
                  }
                  $scope.page = parseInt(response.data.page) + 1;                  
                }
                else{           
                  spinner.stop(); 
                }
            }, function errorCallback(response){
                spinner.stop(); 
        	});
      	}
		  var slideLeftBtn = document.querySelector('#c-button--slide-left');
		  
		  slideLeftBtn.addEventListener('click', function(e) {
			e.preventDefault;
			slideLeft.open();
		  });
      $("div").scroll(function(){
          //$("span").text(x += 1);
      });
      

	$scope.getCountBadge = function(){
		$http.get(apiUrl+'get-dashboard-badge/'+$localStorage.user.id).then(function successCallback(response){            
			if(response.data.status == 'success')
			{ 
				$scope.myQaBadge = response.data.myquestionBadge;
				$scope.qForMeBadge = response.data.questionForMeBadge;
			}
			else{           
				spinner.stop(); 
			}
		}, function errorCallback(response){
			spinner.stop(); 
		});
	}

	$scope.questionClick = function(event, path, showUserQuestion, userId){

		if(event.target.className.indexOf("moreBtn") > -1){
			return;
		} 

		if(userId && userId == $localStorage.user.id){
			//path = "previewquestion/" + path.split("/")[1];
			path = "response-details/" + path.split("/")[1];
			$rootScope.changePage(path);
			return;
		}

		if(event.target.className == "userLink flLeft ng-binding"){
			if(showUserQuestion){
				$rootScope.changePage(path);
			}
		}
		else{
			$rootScope.changePage(path);
		}
	}
});

mainApp.controller('UserQuestController', function($scope,$rootScope,$http,$localStorage,sharedProperties,$routeParams) {
			
	var spinner = $rootScope.showLoader();
		
	$http.get(apiUrl+'get-user-question-list/' + $localStorage.user.id + "/" + $routeParams.id).then(
		function successCallback(response){
			spinner.stop();	
			if(response.data.status == 'success')
			{
				$scope.questions = response.data.questions;
				$scope.username = "";

				if(response.data.questions.length == 0)
				{
					$scope.noData = true;
				}
				else{
					$scope.username = $scope.questions[0].username;
					$scope.noData = false;
				}

				if(response.data.owner_object){
					$scope.avatar = response.data.owner_object.avatar;
					$scope.username = response.data.owner_object.name;
					$scope.isContact = response.data.owner_object.contact;
					$scope.isFollowing = response.data.owner_object.following;
					$scope.userId = response.data.owner_object.id;
				}
				
			}
		}, function errorCallback(response){
			spinner.stop();	
	});

      
});

mainApp.controller('UserAnswerController', function($scope,$rootScope,$http,$localStorage,sharedProperties,$routeParams) {
			
	var spinner = $rootScope.showLoader();
		
	$http.get(apiUrl+'get-answered-questions/' + $localStorage.user.id + "/-1").then(
		function successCallback(response){
			spinner.stop();
			if(response.data.status == 'success')
			{
				$scope.questions = response.data.questions;

				if(response.data.questions.length == 0)
				{
					$scope.noData = true;
				}
				else{
					$scope.noData = false;
				}
			}
		}, function errorCallback(response){
			spinner.stop();	
	});

	$scope.questionClick = function(event, path, showUserQuestion, userId){
		console.log(event, path, showUserQuestion, userId);
		if(userId && userId == $localStorage.user.id){
			path = "previewquestion/" + path.split("/")[1];
			$rootScope.changePage(path);
			return;
		}

		if(event.target.className == "userLink ng-binding"){
			if(showUserQuestion){
				$rootScope.changePage(path);
			}
		}
		else{
			$rootScope.changePage(path);
		}
	}


      
});

mainApp.controller('SignInController', function($scope,$rootScope,$http,$localStorage,sharedProperties,$timeout) {
	//alert('here');
	
	$scope.chkSelctSignup = false;
	$scope.chkSelctSignin = false;
	if(localStorage.getItem("showApiChangeButton") == "true"){
		$scope.showChangeServer = true;
	}
	// $scope.showSignIn = false;
	// $scope.showSignUp = true;

	//var spinner = $rootScope.showLoader();

	// $timeout(function () {
	//     $("#card").flip({
	// 	  trigger: 'manual'
	// 	});
	//     spinner.stop();
 //    }, 100);
	
	$scope.flipPage = function(){
		$(".front").toggle();
		$(".back").toggle();
	}

	$scope.enableDisabledSignUpBtn = function(){
		// if ($scope.chkSelctSignup == true){
		// 	$('#signUpBtn').removeClass("disabled");
		// 	//$('#signUpBtn').removeAttr("disabled");
		// }
		// else{
		// 	$('#signUpBtn').addClass("disabled");
		// 	//$("#signUpBtn").attr("disabled", true);
		// }
	}

	$scope.enableDisabledSigninBtn = function(){
		// if ($scope.chkSelctSignin == true){
		// 	$('#signInBtn').removeClass("disabled");
		// 	//$('#signInBtn').removeAttr("disabled");
		// }
		// else{
		// 	$('#signInBtn').addClass("disabled");
		// 	//$("#signInBtn").attr("disabled", true);
		// }
	}

	$scope.signUpUser =  function(valid){
		if(!$scope.chkSelctSignup){
			$rootScope.showAlert('Alert!', 'Please accept Terms of Service & Privacy Policy before Signup.','Ok');	
			return;
		}
		if(valid)
		{
			var spinner = $rootScope.showLoader();
			var data={
				'username':$scope.user.username,
				'email':$scope.user.email,
				'password':$scope.user.password
			}
			$http.post(apiUrl+'register', data).then(function successCallback(response){
				if(response.data.status == 'success')
				{
					spinner.stop();	
					$rootScope.showAlert('Success!','Registration Success! Please login','Ok');
					$("#card").flip('toggle');

				}
				else if(response.data.status == 'error'){
					spinner.stop();
					$rootScope.showAlert('Sorry!',response.data.errorMsg,'Ok');	
				}
			}, function errorCallback(response){
					$rootScope.loginloader=false;	
			});	
		}
	}
	$scope.signInUser = function(valid){
		if(!$scope.chkSelctSignin){
			$rootScope.showAlert('Alert!', 'Please accept Terms of Service & Privacy Policy before Signin.','Ok');	
			return;
		}
		if(valid)
		{
			var spinner = $rootScope.showLoader();
			var data={
				'username':$scope.signin.username,				
				'password':$scope.signin.password
			}
			$http.post(apiUrl+'login', data).then(function successCallback(response){
				if(response.data.status == 'success')
				{
					spinner.stop();	
					$rootScope.followUserOne(response.data.user.id);
					$localStorage.user = response.data.user;
					$rootScope.user = $localStorage.user; 

					if(typeof(PushNotification) != "undefined"){
		        		var push = PushNotification.init({
				            android: {
				            	clearBadge: true,
				            	"icon": "icon",
				            	sound: true
				                //"senderID": response.data.push_sender_id,
				                //"forceShow": true
				            },
				            ios: {
				            	alert: true,
				            	sound: true,
				            	badge: true,
				            	clearBadge: true
				            }
			            });

			            push.on('registration', function(deviceData) {
			            	localStorage.setItem("pushToken", deviceData.registrationId);
			          		var dataDevice={
								'user_id':$localStorage.user.id,
								'deviceDataVar':deviceData.registrationId,
								'deviceType':deviceData.registrationType
							}

							//alert(deviceData.registrationId);

							$http.post(apiUrl+'add-device', dataDevice).then(function successCallback(response){
								//alert('success');
								//$rootScope.changePage('dashboard');
								$rootScope.showLandingPage();
								//alert(response.status);
							}, function errorCallback(response){
								//alert(response.status);
								//$rootScope.changePage('dashboard');
								$rootScope.showLandingPage();
							});
			            });
			        }
			        else{
			        	var dataDevice={
							'user_id':$localStorage.user.id
							//'deviceDataVar':deviceData.registrationId,
							//'deviceType':deviceData.registrationType
						}

						//alert(deviceData.registrationId);

						$http.post(apiUrl+'add-device', dataDevice).then(function successCallback(response){
							//alert('success');
							//$rootScope.changePage('dashboard');
							$rootScope.showLandingPage();
							//alert(response.status);
						}, function errorCallback(response){
							//alert(response.status);
							//$rootScope.changePage('dashboard');
							$rootScope.showLandingPage();
						});	
			        }
										
				}
				else{
					$rootScope.showAlert('Sorry!','Invalid Credentials!','Ok');
					spinner.stop();
				}
			}, function errorCallback(response){
					$rootScope.loginloader=false;	
			});	
		}
	}
	$("#card").flip({
	  trigger: 'manual'
	});
	
	
});
mainApp.controller('SignUpController', function($scope,$rootScope,$http,$localStorage,sharedProperties) {
	
	
});
mainApp.controller('UserFollowersController', function($scope,$rootScope,$http,$localStorage,sharedProperties) {
    var spinner = $rootScope.showLoader();
    $http.get(apiUrl+'get-followers/'+$localStorage.user.id).then(function successCallback(response){

    if(response.data.status == 'success')
    {	
    	spinner.stop();	
    	$scope.followers = response.data.followers;
    }
    else{						
    	spinner.stop();	
    }
    }, function errorCallback(response){
    	spinner.stop();	
    });
	
});
mainApp.controller('CreateQuestController', function($scope,$rootScope,$http,$localStorage,sharedProperties,$timeout,$compile) {
	  $scope.profileUrl = [];
	  $scope.step1 = true;
	  $scope.step2 = false;
	  $scope.step3 = false;
	  $scope.step4 = false;
	  $scope.step5 = false;
	  $scope.allCategoryDiv = false;
	  $scope.allCategory = false;

	  $scope.isPhone = false;
		if(typeof cordova !== "undefined"){
			$scope.isPhone = true;	
		}

	 //  	$scope.quest = {};
	 //  	$scope.quest.addToCategory = true;
		// $scope.quest.forContacts = true;
		// $scope.privateUsersDiv = true;


	  var spinner = $rootScope.showLoader();
	  $http.get(apiUrl+'get-categories/'+$localStorage.user.id).then(function successCallback(response){
	  	
	  	if(response.data.status == 'success')
	  	{
	  		spinner.stop();	
	  		$scope.categories = response.data.categories;
	  		$scope.category = response.data.selected;
	  	}
	  	else{						
	  		spinner.stop();	
		}

	  	$scope.quest = {};
	  	$scope.quest.addToCategory = true;
		$scope.quest.forContacts = true;
		$scope.privateUsersDiv = true;

	  }, function errorCallback(response){
	  		spinner.stop();
	  });
	  //var spinner = $rootScope.showLoader();
	  $http.get(apiUrl+'get-contacts/'+$localStorage.user.id).then(function successCallback(response){
		if(response.data.status == 'success')
		{
			spinner.stop();
			$scope.allUsers	= response.data.users;
		}
		else{						
			spinner.stop();	
		}
	}, function errorCallback(response){
		spinner.stop();	
	});
	 
	$scope.Gostep2 = function(){
		if($scope.quest.addToCategory && angular.isUndefined($scope.quest.category) && !$scope.allCategory )
		{
			alert('Please select a category');
			return false;
		}	
		$scope.step1 = false;			
		$scope.step2 = true;
		$scope.step3 = false;
		$scope.step4 = false;
		$scope.step5 = false;

		// $scope.quest.addToCategory = true;
		// $scope.quest.forContacts = true;
		// $scope.privateUsersDiv = true;

		// if($('#question_box').val() == '')
		// {
		// 	$('#question_box').css('border-bottom','1px solid red');
		// 	return false;
		// }
		// else{
		// 	$('#question_box').css('border-bottom','');
		// }
		// if($('#datepicker').val() == '')
		// {
		// 	$('#datepicker').css('border-bottom','1px solid red');
		// 	return false;
		// }
		// else{
		// 	$('#datepicker').css('border-bottom','');
		// }
		// $scope.quest.dueDateW3 = $('#datepicker').val();
		// $scope.quest.addToCategory = true;
		// $scope.quest.forContacts = true;
		// $scope.privateUsersDiv = true;
		// $scope.step1 = false;			
		// $scope.step2 = true;
		// $scope.step3 = false;
		// $scope.step4 = false;
		// $scope.step5 = false;
	}
	$scope.Gostep4 = function(){
		if($('#question_box').val() == '')
		{
			$('#question_box').css('border-bottom','1px solid red');
			return false;
		}
		else{
			$('#question_box').css('border-bottom','');
		}
		if($('#datepicker').val() == '')
		{
			$('#datepicker').css('border-bottom','1px solid red');
			return false;
		}
		else{
			$('#datepicker').css('border-bottom','');
		}
		//$scope.quest.dueDateW3 = $('#datepicker').val();
		$scope.quest.dueDateW3 = new Date($('#datepicker').val());
		
		// $scope.quest.addToCategory = true;
		// $scope.quest.forContacts = true;
		// $scope.privateUsersDiv = true;
		$scope.step1 = false;			
		$scope.step2 = false;
		$scope.step3 = false;
		$scope.step4 = true;
		$scope.step5 = false;

		// if($scope.quest.addToCategory && angular.isUndefined($scope.quest.category) && !$scope.allCategory )
		// {
		// 	alert('Please select a category');
		// 	return false;
		// }	
		// $scope.step1 = false;			
		// $scope.step2 = false;
		// $scope.step3 = true;
		// $scope.step4 = false;
		// $scope.step5 = false;
	}
	// $scope.Gostep4 = function(){
	// 	if($scope.quest.addToCategory && angular.isUndefined($scope.quest.category) && !$scope.allCategory )
	// 	{
	// 		alert('Please select a category');
	// 		return false;
	// 	}
	// 	$scope.step1 = false;			
	// 	$scope.step2 = false;
	// 	$scope.step3 = false;
	// 	$scope.step4 = true;
	// 	$scope.step5 = false;
	// 	setTimeout(function(){
	// 		$scope.initiateSlider();
	// 	}, 1000);
	// }

	$scope.Gostep5 = function(){		
		$scope.step1 = false;			
		$scope.step2 = false;
		$scope.step3 = false;
		$scope.step4 = false;
		$scope.step5 = true;
	}

	$scope.goPreviousStep = function(step){
		$scope.step1 = false;
		$scope.step2 = false;
		$scope.step3 = false;
		$scope.step4 = false;
		$scope.step5 = false;
		$scope[step] = true;
	}

	$scope.initiateSlider = function(){
		$(".regular").slick({
	        dots: false,
	        arrows:true,
	        infinite: true,
	        slidesToShow: 1,
	        slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 2000,
			nextArrow: '.sml-slider-righticon',
			prevArrow: '.sml-slider-lefticon'
		});
	}

	$scope.showCategory = function(val){
		if(val)
		{			
			$scope.allCategory = false;
		}
		else{			
			$scope.allCategory = true;
			$scope.quest.category = '';
		}
		//alert($scope.quest.addToCategory);
	}
	$scope.submitQuestion = function(val){
		//$scope.publicQuestion = val;
		if(val)
		{
			$scope.privateUsersDiv = true;
			$scope.allCategory = false;
			$scope.allCategoryDiv = false;
		}
		else{
			$scope.privateUsersDiv = false;
			$scope.allCategory = true;
			$scope.allCategoryDiv = true;
		}
		
	}
	$scope.questionCreate = function(){			
		if($scope.quest.addToCategory && angular.isUndefined($scope.quest.category) && !$scope.allCategory )
		{
			alert('Please select a category');
			return false;
		}
		else if($scope.quest.addToCategory  && angular.isUndefined($scope.quest.category) && !$scope.allCategory){
			alert('Please select a category');
			return false;
		}
        var checkboxValues = [];
        if(!$scope.quest.forContacts){
        	$('input[name=inviteCheck]:checked').map(function() {
				checkboxValues.push($(this).val());
        	});
        }

		var spinner = $rootScope.showLoader();
		var data={
			'user_id':$localStorage.user.id,				
			'title':$scope.quest.title,				
			'category':$scope.quest.category,
			'question':$scope.quest.question,
			'only_for_contacts':$scope.quest.forContacts,
			'share_question':$scope.quest.shareQuestion,
			'reply_anonymous':$scope.quest.replyAnonymous,
			'post_anonymous':$scope.quest.postAnonymous,
			'reference':$('.reference').serialize(),
			//'due_date':$('#datepicker').val(),
			'due_date':new Date($('#datepicker').val()).toGMTString(),
			'invite_contacts':checkboxValues
		}

		$http.post(apiUrl+'save-question', data).then(function successCallback(response){
			if(response.data.status == 'success')
			{
				//$scope.spinner = $rootScope.showLoader();
				$scope.questionId = response.data.questionId;				
				//var imageURI=$scope.profileImage;	
				$.each($scope.profileUrl, function( index, value ) {		
					var imageURI = value;
				  	var uploadUrl=apiUrl+'upload-quest-image/'+$scope.questionId;			
				  	var ft = new FileTransfer();
				  	var options = new FileUploadOptions();
				  	options.fileKey ="file";
				  	options.fileName =imageURI.substr(imageURI.lastIndexOf('/')+1);
				  	options.mimeType ="image/jpeg";
				  	options.chunkedMode = false;			
				  	ft.upload(imageURI, encodeURI(uploadUrl), win, fail, options);
				});
				
				spinner.stop();	
				$scope.Gostep5();
				$timeout(function () {
				       $rootScope.changePage('dashboard');
				 }, 8000);
				//$rootScope.showAlert('Success!','Question created!','Ok');	
			    //$rootScope.changePage('dashboard');	
			}
			else{
				spinner.stop();
				$rootScope.showAlert('Sorry!','Invalid Credentials!','Ok');
				$scope.inviteFriends = false;
				//$rootScope.changePage('dashboard');
			}
		}, function errorCallback(response){
				spinner.stop();	
		});	
	}
	$scope.addReference = function(){		
		var content = $('#addreferencehtml').html();
		if($('.caForm').length == 7){
			$rootScope.showAlert('Sorry!','You have reached the maximum refrence','Ok');
			return false;
		}
		//console.log($('.caForm').length);
		$('.referencediv').append(content);

	}
	$scope.addPhoto = function(){
		var content = $('#addphotohtml').html();
		//alert($('.photodiv').length);
		var res = content.replace("quest_pic", "quest_pic"+$('.photodiv').length);
		if($('.photodiv').length == 7){
			$rootScope.showAlert('Sorry!','You have reached the maximum refrence','Ok');
			return false;
		}
		//console.log($('.photodiv').length);
		var temp = $compile(res)($scope);
		angular.element($('.imageupload_div')).append(temp);
		//$('.imageupload_div').append(content);
	}
	$scope.uploadPic = function(event){
		var imageId = $(event.target).attr('id');
		//alert(imageId);
		navigator.camera.getPicture(function(imageURI){			
				uploadPhoto(imageURI,imageId);
			},function(message) { 				
				$rootScope.showAlert('popupContainer','Error','Couldnt read image!','OK');
			},
			{
				quality         	: 100,
				destinationType 	: navigator.camera.DestinationType.FILE_URI,
				sourceType      	: navigator.camera.PictureSourceType.PHOTOLIBRARY,
				mediaType			: navigator.camera.MediaType.PICTURE,
				encodingType		: navigator.camera.EncodingType.JPEG,
				targetWidth			: 1000,
				targetHeight		: 1000,
				correctOrientation	: true
			}
		);
	}
	function uploadPhoto(imageURI,id){
		var profileImage = document.getElementById(id);
		profileImage.src = "";
		profileImage.src = imageURI;		
		var keys = Object.keys($scope.profileUrl);
		var len = keys.length;		
		$scope.profileUrl.push(imageURI);
		//$scope.profileImage = imageURI;
		//$scope.updateProfilePic();

	}
	function win(r) {
		//alert(r.response);
		/*var spinner = $scope.spinner;

		if(r.response=='success'){			
			spinner.stop();				
			$rootScope.showAlert('Success','Profile picture changed!','OK');			
		}
		else{
			spinner.stop();		
			$rootScope.showAlert('Error','Failed to update profile picture ! .Please try again later!','OK');
		}*/
	}

	function fail(error) {
		var spinner = $scope.spinner;
		spinner.stop();		
		$rootScope.showAlert('Error','Failed to update question image ! .Please try again later!','OK');

	}


	$scope.searchUser = function() {
		var key=$('#user_search').val();
		for (var i = 0; i < $scope.allUsers.length; i++) {
			if($scope.allUsers[i].name.toLowerCase().indexOf(key.toLowerCase()) >= 0){
				$scope.allUsers[i].show	= true;
			}
			else{
				$scope.allUsers[i].show	= false;
			}
		};
		
	}


	var dateToday = new Date();
	$( function() {
		if(typeof(cordova) == 'undefined'){
	    	$( "#datepicker" ).datepicker({ dateFormat: 'D dd MM y' ,minDate: dateToday,});
	    }
	  } );
});
mainApp.controller('MyProfileController', function($scope,$rootScope,$http,$localStorage,sharedProperties) {

	goToHome = true;
	$scope.isPhone = false;
	if(typeof cordova !== "undefined"){
		$scope.isPhone = true;			
	}

	$scope.uploadProfilePic = function() {		
		navigator.camera.getPicture(uploadPhoto,function(message) { 				
				$rootScope.showAlert('popupContainer','Error','Couldnt read image!','OK');
			},
			{
				quality         	: 100,
				destinationType 	: navigator.camera.DestinationType.FILE_URI,
				sourceType      	: navigator.camera.PictureSourceType.PHOTOLIBRARY,
				mediaType			: navigator.camera.MediaType.PICTURE,
				encodingType		: navigator.camera.EncodingType.JPEG,
				targetWidth			: 1000,
				targetHeight		: 1000,
				correctOrientation	: true
			}
		);
	}
	$scope.updateProfilePic = function() {
		$scope.spinner = $rootScope.showLoader();
		var imageURI=$localStorage.profileUrl;		
		if(typeof $localStorage.profileUrl === 'undefined')
		{	
			spinner.stop();
			$rootScope.changePage('myprofile');
		}
		else{
			var uploadUrl=apiUrl+'update-avatar/'+$localStorage.user.id;			
			var ft = new FileTransfer();
			var options = new FileUploadOptions();
			options.fileKey="file";
			options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
			options.mimeType="image/jpeg";
			options.chunkedMode = false;			
			ft.upload(imageURI, encodeURI(uploadUrl), win, fail, options);
			
		}
	}
	function uploadPhoto(imageURI){	
		var profileImage = document.getElementById('profileImageIndex');
		profileImage.src = "";
		profileImage.src = imageURI;
		$localStorage.profileUrl=imageURI;
		$scope.updateProfilePic();

	}
	function win(r) {
		var spinner = $scope.spinner;
		var response = JSON.parse(r.response);
		//alert(response.profileImage);
		if(response.status == 'success'){			
			spinner.stop();				
			$rootScope.showAlert('Success','Profile picture changed!','OK');			
		}
		else{
			spinner.stop();		
			$rootScope.showAlert('Error','Failed to update profile picture ! .Please try again later!','OK');
		}
	}

	function fail(error) {
		var spinner = $scope.spinner;
		spinner.stop();		
		$rootScope.showAlert('Error','Failed to update profile picture ! .Please try again later!','OK');

	}
});
mainApp.controller('QuestionsToMeController', function($scope,$rootScope,$http,$localStorage,sharedProperties) {
	var spinner = $rootScope.showLoader();
	$http.get(apiUrl+'get-questions-to-me/'+$localStorage.user.id).then(function successCallback(response){
			if(response.data.status == 'success')
			{
				spinner.stop();	
				$scope.questions = response.data.questions;
				for (var i = 0; i < $scope.questions.length; i++) {
					$scope.questions[i].timeCountDown = getTimeCountDown($scope.questions[i].due_date);
				}
			}
			else{						
				spinner.stop();	
			}
			if(response.data.questions.length == 0)
			{
				$scope.noData = true;
			}
			else{
				$scope.noData = false;
			}
		}, function errorCallback(response){
			spinner.stop();	
	});

	$scope.questionClick = function(event, path, showUserQuestion, userId){
		console.log(event, path, showUserQuestion, userId);
		if(userId && userId == $localStorage.user.id){
			path = "previewquestion/" + path.split("/")[1];
			$rootScope.changePage(path);
			return;
		}

		if(event.target.className == "userLink ng-binding"){
			if(showUserQuestion){
				$rootScope.changePage(path);
			}
		}
		else{
			$rootScope.changePage(path);
		}
	}

});
mainApp.controller('QuestionsToMeMoreController', function($scope,$rootScope,$http,$localStorage,sharedProperties) {
	
	
});
mainApp.controller('ResponseDeatilsController', function($scope,$rootScope,$http,$localStorage,sharedProperties,$routeParams) {
	var spinner = $rootScope.showLoader();
	$http.get(apiUrl+'get-response-details/'+$routeParams.id).then(function successCallback(response){
			if(response.data.status == 'success')
			{
				spinner.stop();	
				$scope.question = response.data.question;
				response.data.question.due_date = response.data.question.due_date.split(" ").join("T");
				$scope.dueDateW3 = new Date(response.data.question.due_date + "+00:00");
				$scope.daysLeft = response.data.daysLeft;
				$scope.yesCount = response.data.yes_count;
				$scope.noCount = response.data.no_count;
				$scope.totalCount = $scope.yesCount + $scope.noCount;
				//$scope.answeredBy = response.data.answered_by;
				$scope.responses = response.data.responses;
				$scope.canDelete = false;
				//if((new Date()) < (new Date($scope.question.due_date)) ){
				if((new Date()) < (new Date($scope.question.due_date)) ){
					$scope.canDelete = true;
				}
				
				// if(response.data.question.user_id == $localStorage.user.id){
				// 	$scope.canDelete = true;
				// }
			}
			else{						
				spinner.stop();	
			}
		}, function errorCallback(response){
			spinner.stop();	
	});

	$scope.answerQuestionClick = function(answer,questId){
		$scope.answer = answer;
		$scope.questId = questId;
		$('#myModal').modal('show');
	}	

	$scope.closeModal = function(){
		$scope.decisionreason = "";
		$scope.answer = "";
		$scope.questId = "";
		$('#myModal').modal('hide');
	}
	$scope.submitModal = function(){
		$scope.answerQuestion($scope.answer,$scope.questId,$scope.decisionreason);
		$scope.closeModal();
	}

	$scope.answerQuestion = function(answer,questId,reason){
		if(answer =='' && questId == '')
		{
			$rootScope.showAlert('Error','Something went wrong!','OK');
			return false;
		}
		if(reason == '' || reason == undefined)
		{
			$rootScope.showAlert('Error','Please tell us why you made this decision!','OK');
			return false;
		}
		//return false;
		var spinner = $rootScope.showLoader();
		var data={
			'user_id':$localStorage.user.id,
			'question_id':questId,
			'answer':answer,
			'answer_why':reason,
			'answer_maybe':''
		}
		$http.post(apiUrl+'answer-question', data).then(function successCallback(response){
			spinner.stop();
			if(response.data.status == 'success')
			{
				$rootScope.tab	 = 'tab1';		
				//$rootScope.showAlert('Success','Changes saved!','OK');
				if(window.location.hash == "#/questfrom-me"){
					$route.reload();
				}
				else{
					$rootScope.goBack();
				}
				//$rootScope.changePage('questfrom-me');
				
				
			}
			else if(response.data.status == 'error'){
				spinner.stop();
			}
		}, function errorCallback(response){
				spinner.stop();
		});	
	}
	
});
mainApp.controller('answerQuestController', function($scope,$rootScope,$http,$localStorage,sharedProperties,$routeParams) {
	var spinner = $rootScope.showLoader();
	/*$(".regular").slick({
  	        dots: true,
  	        infinite: false,
  	        slidesToShow: 1,
  	        slidesToScroll: 1,
  			autoplay: false,
  			autoplaySpeed: 2000
  	      });*/
	$http.get(apiUrl+'get-question-deatils/'+$routeParams.id+'/'+$localStorage.user.id).then(function successCallback(response){
			if(response.data.status == 'success')
			{
				spinner.stop();	
				$scope.question = response.data.question;
				$scope.daysLeft = response.data.daysLeft;
				$scope.isAnswered = response.data.isAnswered;
				$scope.yesCount = response.data.yes_count;
				$scope.noCount = response.data.no_count;
				$scope.dueDateW3 = response.data.dueDateW3;
				$scope.references = response.data.references;
				$scope.questImage = response.data.questImage;
				$scope.owner_answer = response.data.owner_answer;
				$scope.owner_answer_why = response.data.owner_answer_why;
				$scope.login_user_owner_answer = response.data.login_user_owner_answer;
				$scope.login_user_owner_answer_why = response.data.login_user_owner_answer_why;
				$scope.canDelete = false;
				if(response.data.question){
					//$scope.dueDateW3 = convertDateToLocalDate(response.data.question.due_date);
					response.data.question.due_date = response.data.question.due_date.split(" ").join("T");
					$scope.dueDateW3 = new Date(response.data.question.due_date + "+00:00");
					
				}
				console.log($scope.question);

				if(response.data.question.user_id == $localStorage.user.id)
					$scope.canDelete = true;
				setTimeout(function(){
				   $scope.initiateSlider();
				}, 1000);
				
			}
			else{						
				spinner.stop();	
			}
		}, function errorCallback(response){
			spinner.stop();	
	});
	$scope.answer = '';
	$scope.answerMayBe = '';
	$scope.selectAnswer = function(event){
		$scope.answerMayBe = '';
		var obj = event.target;
		//$('.select-ans').removeClass('selectedAnswer');
		//$(obj).addClass('selectedAnswer');
		if($(obj).data('val') == "yes"){
			$('.select-ans').removeClass('selectedNoAnswer');
			$(obj).addClass('selectedYesAnswer');
		}
		if($(obj).data('val') == "no"){
			$('.select-ans').removeClass('selectedYesAnswer');
			$(obj).addClass('selectedNoAnswer');
		}
		$scope.answer=$(obj).data('val'); 
	}
	$scope.removeAnswer = function(){	
		if($scope.answerMayBe == '')
		{
			$scope.answer = "yes";
			$('.select-ans-yes').addClass('selectedAnswer');
		}
		else{
			$scope.answer = "maybe";
			$('.select-ans').removeClass('selectedAnswer');
		}
	}

	$scope.submitAnswer = function(){
		var spinner = $rootScope.showLoader();
		if($scope.question.anonymous == undefined) {
			$scope.anonymous = 'no';
		} else {
			$scope.anonymous = $scope.question.anonymous;
		}
		var data={
			'user_id':$localStorage.user.id,
			'question_id':$routeParams.id,
			'answer':$scope.answer,
			'answer_maybe':$scope.answerMayBe,
			'answer_why':$scope.question.why,
			'anonymous':$scope.anonymous
		}
		if($scope.answer == '') {
			$rootScope.showAlert('Error!','Please Select any one option!','OK');
			spinner.stop();
			return false;
		}
		$http.post(apiUrl+'answer-question', data).then(function successCallback(response){
			spinner.stop();
			if(response.data.status == 'success')
			{
				$rootScope.showAlertWithShareBtn('Brilliant!', "Your connection will be thankful you've given your input.", 'OK', 'I just said ' + data.answer + ' on Decidable to the question "' + $scope.question.question + '". Share your opinion too!');
		        if($routeParams.id2 == 'dashboard'){
		          	$rootScope.changePage('dashboard');
		        }
		        else{
					$rootScope.changePage('questtome');
		        }
				//route.reload();
			}
			else if(response.data.status == 'error'){
				spinner.stop();
			}
		}, function errorCallback(response){
				spinner.stop();
		});	
	}

	$scope.goBackFromAnswer = function(){
		if($routeParams.id2 == 'dashboard'){
			$rootScope.changePage('dashboard');
		}
		else{
			$rootScope.changePage('questtome');
		}
	}

	$scope.initiateSlider = function(){
	  	console.log('dasd');
  		//$('.carousel').carousel();
  		$(".regular").slick({
			dots: false,
			arrows:true,
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 2000,
			nextArrow: '.sml-slider-righticon',
			prevArrow: '.sml-slider-lefticon'
  	    });
	}
});
mainApp.controller('QuestionsFromMeController', function($scope,$rootScope,$http,$localStorage,sharedProperties,$route,$timeout) {
	if($rootScope.tab == 'tab1')
	{
		$timeout(function () {
		$('.nav-tabs li:eq(1) a').tab('show');
		 }, 50);
	}
	
	var spinner = $rootScope.showLoader();
	$http.get(apiUrl+'get-user-questions/'+$localStorage.user.id).then(function successCallback(response){
			if(response.data.status == 'success')
			{
				$('.nav-tabs li:eq(1) a').tab('show');
				spinner.stop();	
				$scope.questions = response.data.questions;
				$scope.closingQuestions = response.data.closingQuestions;

				var closedQuestions = Object.keys(response.data.closedQuestions).map((k) => response.data.closedQuestions[k]); 
				for (var i = 0; i < closedQuestions.length; i++) {
					closedQuestions[i].updated_at = closedQuestions[i].updated_at.split(" ").join("T");
				}

				// Sort closed decisions by most recent at top, oldest at bottom.
				//var closedQuestions = Object.keys(response.data.closedQuestions).map((k) => response.data.closedQuestions[k]); 
				closedQuestions.sort((a,b) => {
					return new Date(b.updated_at) - new Date(a.updated_at);
				});
				$scope.closedQuestions = closedQuestions;  //response.data.closedQuestions;

				var openQuestions = Object.keys(response.data.questions).map((k) => response.data.questions[k]); 
				for (var i = 0; i < openQuestions.length; i++) {
					openQuestions[i].updated_at = openQuestions[i].updated_at.split(" ").join("T");
				}

				openQuestions.sort((a,b) => {
					return new Date(b.updated_at) - new Date(a.updated_at);
				});
				$scope.questions = openQuestions;
			}
			else{						
				spinner.stop();	
			}
		}, function errorCallback(response){
			spinner.stop();	
	});
	$scope.closeModal = function(){
		$scope.decisionreason = "";
		$('#myModal').modal('hide');
	}
	$scope.closeModal = function(){
		$scope.decisionreason = "";
		$scope.answer = "";
		$scope.questId = "";
		$('#myModal').modal('hide');
	}
	$scope.submitModal = function(){
		$scope.answerQuestion($scope.answer,$scope.questId,$scope.decisionreason);
		$scope.closeModal();
	}

	$scope.answerQuestionClick = function(answer,questId){
		$scope.answer = answer;
		$scope.questId = questId;
		$('#myModal').modal('show');
	}
	$scope.answerQuestion = function(answer,questId,reason){
		if(answer =='' && questId == '')
		{
			$rootScope.showAlert('Error','Something went wrong!','OK');
			return false;
		}
		if(reason == '' || reason == undefined)
		{
			$rootScope.showAlert('Error','Please tell us why you made this decision!','OK');
			return false;
		}
		//return false;
		var spinner = $rootScope.showLoader();
		var data={
			'user_id':$localStorage.user.id,
			'question_id':questId,
			'answer':answer,
			'answer_why':reason,
			'answer_maybe':''
		}
		$http.post(apiUrl+'answer-question', data).then(function successCallback(response){
			spinner.stop();
			if(response.data.status == 'success')
			{
				$rootScope.tab	 = 'tab1';		
				//$rootScope.showAlert('Success','Changes saved!','OK');
				//$rootScope.changePage('questtome');
				$route.reload();
				
			}
			else if(response.data.status == 'error'){
				spinner.stop();
			}
		}, function errorCallback(response){
				spinner.stop();
		});	
	}

	
});
mainApp.controller('QuestionsFromGroupsController', function($scope,$rootScope,$http,$localStorage,sharedProperties) {
	var spinner = $rootScope.showLoader();
	$http.get(apiUrl+'get-public-questions').then(function successCallback(response){
			if(response.data.status == 'success')
			{
				spinner.stop();	
				$scope.questions = response.data.questions;
			}
			else{						
				spinner.stop();	
			}
		}, function errorCallback(response){
			spinner.stop();	
	});
	
});
mainApp.controller('FollowersController', function($scope,$rootScope,$http,$localStorage,sharedProperties) {
	var spinner = $rootScope.showLoader();
	$http.get(apiUrl+'get-follower-page-data/'+$localStorage.user.id).then(function successCallback(response){
			
			if(response.data.status == 'success')
			{	
				spinner.stop();	
				$scope.isApproved = 1;
				$scope.categories = response.data.categories;
				$scope.users = response.data.users;
				$scope.category = response.data.selected;
				$scope.categoryTab = "activeCategoryTab";
				$scope.teamTab = "inactiveCategoryTab";
				setTimeout(function(){
				   $scope.checkAllInit();
				}, 0);
			}
			else{						
				spinner.stop();	
			}
			if(document.getElementById("home")){
				document.getElementById("home").style.height = (screen.height - 300) + "px"
			}
		}, function errorCallback(response){
			spinner.stop();		
	});

	$scope.follow = function(){

		var val = [];
        $(':checkbox:checked').each(function(i){
          val[i] = $(this).val();
        });
		var data={
			'user_id':$localStorage.user.id,
			'category_id':val
		}
		$http.post(apiUrl+'follow', data).then(function successCallback(response){
			if(response.data.status == 'success')
			{
				spinner.stop();
				$rootScope.showAlert('Well Done!','Categories will be added immediately. Team requests are approved and then added.','OK');
				//route.reload();
				$rootScope.changePage('dashboard');
			}
			else if(response.data.status == 'error'){
				spinner.stop();
			}
		}, function errorCallback(response){
				
		});	
	}
	$scope.checkAllInit = function(){
		$('#checkboxOne0').click(function(){
			$('input:checkbox').not(this).prop('checked', this.checked);
		});

	}

	$scope.changeIsApproved = function(val){
		if($scope.categories[0].name == "All"){
			$scope.categories[0].approved = val;
		}
		if(val==1){
			$scope.categoryTab = "activeCategoryTab";
			$scope.teamTab = "inactiveCategoryTab";
		}
		else{
			$scope.categoryTab = "inactiveCategoryTab";
			$scope.teamTab = "activeCategoryTab";
		}
		$scope.isApproved = val;
	}

	$scope.searchCategory = function(val){
		var key = $('#category_search').val().toLowerCase();
		var categoryItems = $(".categoryItems");
		for (var i = 0; i < categoryItems.length; i++) {
			if(categoryItems[i].getAttribute('name').toLowerCase().indexOf(key) >= 0){
				categoryItems[i].hidden = false;
			}
			else{
				categoryItems[i].hidden = true;
			}
		}
	}
	
});
mainApp.controller('ContactsController', function($scope,$rootScope,$http,$localStorage,sharedProperties,$route) {
	var spinner = $rootScope.showLoader();
	$(".scrollbar-inner").height((window.screen.height - 290) + "px");
	$http.get(apiUrl+'get-contacts/'+$localStorage.user.id).then(function successCallback(response){
		if(response.data.status == 'success')
		{
			spinner.stop();
			$scope.allUsers	= response.data.users;
		}
		else{						
			spinner.stop();	
		}
		$(".scrollbar-inner").height((window.screen.height - 310) + "px");
	}, function errorCallback(response){
		spinner.stop();	
	});

	$scope.searchUser = function() {
			var key=$('#user_search').val();
			if(key == '')
			{
				key="";					
				$scope.allUsers='';
				$route.reload();
				return false;
			}
			var spinner = $rootScope.showLoader();
			$http.get(apiUrl+'search-users?key='+key+'&user='+$localStorage.user.id).then(function successCallback(response){
					if(response.data.status == 'success')
					{
						$scope.allUsers	= response.data.users;									
						$scope.emptyMessage = false;
						spinner.stop();	
					}
					else if(response.data.status == 'empty'){
						$scope.emptyMessage = true;
						$scope.allUsers='';
						spinner.stop();	
					}
					else{						
						spinner.stop();	
					}
					$(".scrollbar-inner").height((window.screen.height - 310) + "px");
				}, function errorCallback(response){
						spinner.stop();	
			});
	}

	$scope.addContact = function(userId) {
			var spinner = $rootScope.showLoader();
			$http.post(apiUrl+'add-contact/'+$localStorage.user.id+'/'+userId).then(function successCallback(response){
					if(response.data.status == 'success')
					{	
						spinner.stop();														
						$route.reload();
					}
					else if(response.data.status == 'empty'){
						$scope.emptyMessage = true;
						$rootScope.allUsers='';
						spinner.stop();
					}
					else{						
						spinner.stop();
					}
					$(".scrollbar-inner").height((window.screen.height - 310) + "px");
				}, function errorCallback(response){
				spinner.stop();
			});
	}
	$scope.removeContact = function(userId) {
			var spinner = $rootScope.showLoader();
			$http.post(apiUrl+'delete-contact/'+$localStorage.user.id+'/'+userId).then(function successCallback(response){
					if(response.data.status == 'success')
					{	
						spinner.stop();														
						$route.reload();
					}
					else if(response.data.status == 'empty'){
						$scope.emptyMessage = true;
						$rootScope.allUsers='';
						spinner.stop();
					}
					else{						
						spinner.stop();
					}
					$(".scrollbar-inner").height((window.screen.height - 310) + "px");
				}, function errorCallback(response){
				spinner.stop();
			});
	}
	$scope.followContact = function(userId){
		var spinner = $rootScope.showLoader();
		$http.post(apiUrl+'follow-contact/'+$localStorage.user.id+'/'+userId).then(function successCallback(response){
				if(response.data.status == 'success')
				{	
					spinner.stop();														
					$route.reload();
				}
				else if(response.data.status == 'empty'){
					$scope.emptyMessage = true;
					$rootScope.allUsers='';
					spinner.stop();
				}
				else{						
					spinner.stop();
				}
			}, function errorCallback(response){
			spinner.stop();
		});
	}
	$scope.unfollowContact = function(userId){
		var spinner = $rootScope.showLoader();
		$http.post(apiUrl+'unfollow-contact/'+$localStorage.user.id+'/'+userId).then(function successCallback(response){
				if(response.data.status == 'success')
				{	
					spinner.stop();														
					$route.reload();
				}
				else if(response.data.status == 'empty'){
					$scope.emptyMessage = true;
					$rootScope.allUsers='';
					spinner.stop();
				}
				else{						
					spinner.stop();
				}
			}, function errorCallback(response){
			spinner.stop();
		});
	}

	$scope.sendInviteEmail = function(email){

		if(email == "" || email == undefined){
			alert('please enter a valid email');
			return false;
		}
		else{
			var data = {
				invite_email:email,
				user_id : $localStorage.user.id
			};
			var spinner = $rootScope.showLoader();
			$http.post(apiUrl+'send-invite-email',data).then(function successCallback(response){
					if(response.data.status == 'success')
					{	
						spinner.stop();														
						//$route.reload();
						//$scope.inviteEmail = '';
						$rootScope.showAlert('Success!','Invite sent!','Ok');
					}
					
					else{						
						spinner.stop();
					}
				}, function errorCallback(response){
				spinner.stop();
			});
		}

	}
	
	

	setTimeout(function(){
	   jQuery('.scrollbar-inner').scrollbar();
	}, 0);


});

mainApp.controller('helpController', function($scope,$rootScope,$http,$localStorage,sharedProperties) {

  var spinner = $rootScope.showLoader();
  $http.get(apiUrl+'get-helps').then(function successCallback(response){
      if(response.data.status == 'success')
      {
        $scope.helps = response.data.helps;
        spinner.stop(); 
        $scope.toggleHelp();
      }      
      else{           
        spinner.stop(); 
      }
    }, function errorCallback(response){
        spinner.stop(); 
  });
  $scope.toggleHelp = function(){    
    setTimeout(function(){
         $('.faq_question').click(function() {
          
            if ($(this).parent().is('.open')){
              $(this).closest('.faq').find('.faq_answer_container').animate({'height':'0'},500);
              $(this).closest('.faq').removeClass('open');
          
              }else{
                var newHeight =$(this).closest('.faq').find('.faq_answer').height() +'px';
                $(this).closest('.faq').find('.faq_answer_container').animate({'height':newHeight},500);
                $(this).closest('.faq').addClass('open');
              }
          
          });
      }, 1000);
  }
  
											  
});
mainApp.controller('ViewProfileController', function($scope,$rootScope,$http,$localStorage,sharedProperties,$routeParams) {
  var spinner = $rootScope.showLoader();
    $http.get(apiUrl+'get-user/'+$routeParams.id).then(function successCallback(response){
      if(response.data.status == 'success')
      { 
        spinner.stop(); 
        $scope.visitor = response.data.user;
        $scope.memberSince = response.data.member_since;
        $scope.visitorAvatar = response.data.avatar;
      }
      else{           
        spinner.stop(); 
      }
    }, function errorCallback(response){
        spinner.stop(); 
    });
  
});
mainApp.controller('ResetPasswordController', function($scope,$rootScope,$http,$localStorage,sharedProperties,$routeParams) {
  $scope.resetPassword = function(valid){
  	if(valid){
  		//console.log($localStorage.user);
  		if(typeof $scope.resetemail === 'undefined') {
			alert("Please enter an email address");
			return false;
		} 
  		var data = {
  			reset_email:$scope.resetemail
  			//user_id : $localStorage.user.id
  		};
  		var spinner = $rootScope.showLoader();
  		$http.post(apiUrl+'reset-password',data).then(function successCallback(response){
  				if(response.data.status == 'success')
  				{	
  					spinner.stop();														
  					//$route.reload();
  					//$scope.inviteEmail = '';
  					$rootScope.showAlert('Success!','New password has been sent to your email!','Ok');
  					$rootScope.changePage('signin');
  				}
  				
  				else{						
  					spinner.stop();
  					$rootScope.showAlert('Error!',response.data.message,'Ok');
  				}
  			}, function errorCallback(response){
  			spinner.stop();
  		});
  	}
  }
  
});
mainApp.controller('ChangePasswordController', function($scope,$rootScope,$http,$localStorage,sharedProperties,$routeParams) {
  $scope.changePassword = function(valid){
  	if(valid){
  		var data = {
  			old_password:$scope.oldpassword,
  			password:$scope.password,
  			password_confirmation:$scope.repassword,
  			user_id : $localStorage.user.id
  		};
  		var spinner = $rootScope.showLoader();
  		$http.post(apiUrl+'change-password',data).then(function successCallback(response){
  				if(response.data.status == 'success')
  				{	
  					spinner.stop();														
  					//$route.reload();
  					//$scope.inviteEmail = '';
  					$rootScope.showAlert('Success!',response.data.message,'Ok');
  					$rootScope.changePage('dashboard');
  				}
  				
  				else{						
  					spinner.stop();
  					$rootScope.showAlert('Error!',response.data.message,'Ok');
  				}
  			}, function errorCallback(response){
  			spinner.stop();
  		});
  	}
  }
  
});