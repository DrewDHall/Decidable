//Wesite and local
/*var apiUrl='http://snsdev:8015/api/v1/';
var siteDomainUrl='http://snsdev:8015/';
var currentDeviceType = "web";*/


//Dev
//var apiUrl='http://quark.socializer.io/api/v1/';
var apiUrl='http://quark.decidable.co/api/v1/';

//Test
apiUrl='http://quarktest.socializer.io/api/v1/';


//var siteDomainUrl='http://quark.socializer.io/';
var siteDomainUrl='http://quark.decidable.co/';
var currentDeviceType = "mobile";

if(localStorage.getItem("apiUrl") != null && localStorage.getItem("apiUrl") != ""){
	apiUrl = localStorage.getItem("apiUrl");
}

var fcmSenderId = "156810497999";
//var fcmSenderId = "709227886514";


//Live
/*var apiUrl='http://ec2-34-213-157-18.us-west-2.compute.amazonaws.com/api/v1/';
var siteDomainUrl='http://ec2-34-213-157-18.us-west-2.compute.amazonaws.com/';
var currentDeviceType = "mobile";*/