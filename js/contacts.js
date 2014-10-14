(function () {

	var availableStates = [
		"AL",
		"AK",
		"AS",
		"AZ",
		"AR",
		"CA",
		"CO",
		"CT",
		"DE",
		"DC",
		"FM",
		"FL",
		"GA",
		"GU",
		"HI",
		"ID",
		"IL",
		"IN",
		"IA",
		"KS",
		"KY",
		"LA",
		"ME",
		"MH",
		"MD",
		"MA",
		"MI",
		"MN",
		"MS",
		"MO",
		"MT",
		"NE",
		"NV",
		"NH",
		"NJ",
		"NM",
		"NY",
		"NC",
		"ND",
		"MP",
		"OH",
		"OK",
		"OR",
		"PW",
		"PA",
		"PR",
		"RI",
		"SC",
		"SD",
		"TN",
		"TX",
		"UT",
		"VT",
		"VA",
		"VI",
		"WA",
		"DC",
		"WV",
		"WI",
		"WY",
	];

	function LoadBusiness(data) {

		$('#filter').html(can.view('views/filterView.ejs', {
				categories : data
			}));
	}

	function LoadContacts(data) {
		GetContactServer({
			Business : data
		}, function (data) {
			var j = {
				contacts : data
			};
			$('#contacts').html("");
			$('#contacts').html(can.view('views/contactsList.ejs', {
					contacts : data
				}));
		});
	}

	function LoadUserDefined(data) {
		GetUserServer(data, function (data) {
			$('#users').html("");
			$('#users').html(can.view('views/userList.ejs', {
					user : data
				}));
		});
	}

	function ShowAddContact() {

		var data = {};

		data.CConId = createGuid();
		data.CBusId = $('#filter').find('.active').find('a').attr('data-category')

			var x = (can.view('views/createView.ejs', {
					contact : data,
					categories : {},
				}));

		$('#create').empty();
		$('#create').hide();
		$('#create').append(x);
		$('#create').slideDown();

	}

	function HideAddContact() {
		$('#create').slideUp();
	}

	function SetUpBusinessEditMask() {
		//Set Up Phone Mask on All Phone Numbers//
		var dateBoxes = $("input[name='BPhone1']");
		dateBoxes.mask("(999) 999-9999");

		var dateBoxes = $("input[name='BPhone2']");
		dateBoxes.mask("(999) 999-9999");

		var stateAutoComplete = $("input[name='BState']");
		stateAutoComplete.autocomplete({
			source : availableStates
		});
	}

	function ShowAddBusiness() {

		var data = {};

		data.BBusId = createGuid();

		var x = (can.view('views/createBusiness.ejs', {
				business : data
			}));

		$('#createBusiness').empty();
		$('#createBusiness').hide();
		$('#createBusiness').append(x);
		$('#createBusiness').slideDown();

		$('#businessButtonBar').hide();

		SetUpBusinessEditMask();

	}

	function ShowAddUser() {

		var data = {};

		data.UUsrId = createGuid();
		data.UBusId = $("#storedData").data('business');
		data.UConId = $("#storedData").data('contact');

		var x = (can.view('views/createUser.ejs', {
				user : data
			}));

		$('#createUser').empty();
		$('#createUser').hide();
		$('#createUser').append(x);
		$('#createUser').slideDown();

	}

	function HideAddBusiness() {
		$('#createBusiness').slideUp(200);
	}

	function HideAddUser() {
		$('#createUser').slideUp();
	}

	function DeleteBusinessServer(data, callback) {
		$.ajax({
			type : "GET",
			url : "/ContactsManager/Service1.svc/DeleteBusiness",
			data : data,
			contentType : "application/json; charset=utf-8",
			processData : true,
			dataType : 'json',
		})
		.done(function (result, response) {
			callback(result, response);
		});
	}
	function DeleteUserServer(data, callback) {
		$.ajax({
			type : "GET",
			url : "/ContactsManager/Service1.svc/DeleteUserDefined",
			data : data,
			contentType : "application/json; charset=utf-8",
			processData : true,
			dataType : 'json',
		})
		.done(function (result, response) {
			callback(result, response);
		});
	}

	function DeleteContactServer(data, callback) {
		$.ajax({
			type : "GET",
			url : "/ContactsManager/Service1.svc/DeleteContact",
			data : data,
			contentType : "application/json; charset=utf-8",
			processData : true,
			dataType : 'json',
		})
		.done(function (result) {
			callback(result);
		});
	}

	function UpdateContactServer(data, callback) {
		$.ajax({
			type : "POST",
			url : "/ContactsManager/Service1.svc/UpdateContact",
			data : data,
			contentType : "application/json; charset=utf-8",
			processData : true,
			dataType : 'json',
		})
		.done(function (result) {
			callback(result);
		});
	}

	function CreateContactServer(data, callback) {
		$.ajax({
			type : "POST",
			url : "/ContactsManager/Service1.svc/AddContact",
			data : data,
			contentType : "application/json; charset=utf-8",
			dataType : 'json',
		})
		.done(function (result) {
			callback(result);
		});

	}

	function CreateUserDefinedServer(data, callback) {
		$.ajax({
			type : "POST",
			url : "/ContactsManager/Service1.svc/AddUserDefined",
			data : data,
			contentType : "application/json; charset=utf-8",
			dataType : 'json',
		})
		.done(function (result) {
			callback(result);
		});

	}

	function CreateBusinessServer(data, callback) {
		$.ajax({
			type : "POST",
			url : "/ContactsManager/Service1.svc/AddBusiness",
			data : data,
			contentType : "application/json; charset=utf-8",
			dataType : 'json',
		})
		.done(function (result, response) {
			callback(result, response);
		});

	}

	function GetContactServer(data, callback) {
		$.ajax({
			type : "GET",
			url : "/ContactsManager/Service1.svc/GetContacts",
			data : data,
			contentType : "application/json; charset=utf-8",
			dataType : 'json',
		})
		.done(function (result) {
			callback(result);
		});
	}

	function UpdateBusinessServer(data, callback) {
		$.ajax({
			type : "POST",
			url : "/ContactsManager/Service1.svc/UpdateBusiness",
			data : data,
			contentType : "application/json; charset=utf-8",
			processData : true,
			dataType : 'json',
		})
		.done(function (result, response) {
			callback(result, response);
		});
	}

	function UpdateUserDefinedServer(data, callback) {
		$.ajax({
			type : "POST",
			url : "/ContactsManager/Service1.svc/UpdateUserDefined",
			data : data,
			contentType : "application/json; charset=utf-8",
			processData : true,
			dataType : 'json',
		})
		.done(function (result, response) {
			callback(result, response);
		});
	}

	function findAllBusiness(data, callback) {
		$.ajax({
			type : "GET",
			cache : false,
			url : "../ContactsManager/Service1.svc/GetBusiness/",
			data : data,
			contentType : "application/json; charset=utf-8",
			dataType : 'json',
		})
		.done(function (result, response) {
			callback(result);
		});
	}

	function GetUserServer(data, callback) {
		$.ajax({
			type : "GET",
			url : "../ContactsManager/Service1.svc/GetUserDefined",
			data : data,
			contentType : "application/json; charset=utf-8",
			dataType : 'json',
		})
		.done(function (result) {
			callback(result);
		});
	}

	function LoadAllBusiness(data) {

		findAllBusiness(data, function (response) {

			LoadBusiness(response);

			//Set Up Phone Mask on All Phone Numbers//
			SetUpBusinessEditMask();

			$(".updateBusinessButton").button({
				icons : {
					primary : "ui-icon-gear",
					secondary : "ui-icon-triangle-1-s"
				}
			});

			$(".deleteBusinessButton").button({
				icons : {
					primary : "ui-icon-gear",
					secondary : "ui-icon-triangle-1-s"
				}
			});

			$(".updateBusinessButton").click(function (event) {
				event.preventDefault();

				var form = $(this).closest('form');
				var x = new Parsley(form);
				var valid = x.validate();

				if (valid) {
					UpdateBusiness($(this));
					data = {};
					data.Filter = '';
					LoadAllBusiness(data);
				}

			});

			$(".deleteBusinessButton").click(function (event) {
				event.preventDefault();
				var element = $(this);
				var data = {};
				$("#MessageConfirm").dialog({
					buttons : {
						"Confirm" : function () {
							data.Business = element.attr('id');
							DeleteBusiness(element, data);
							$(this).dialog("close");
						},
						"Cancel" : function () {
							$(this).dialog("close");
						}
					}
				});

			});
			$(".business").hide();

			// update perfect scrollbar
			jQuery('.scrollbar-vista').scrollbar({
				"showArrows" : true,
				"type" : "advanced"
			});

		});
	}

	function UpdateBusiness(element) {
		var form = element.closest('form');

		var x = new Parsley(form);
		var valid = x.validate();

		if (valid) {
			data = can.deparam(form.serialize());
			data.BPhone1 = data.BPhone1.replace(/\D/g, '');
			data.BPhone2 = data.BPhone2.replace(/\D/g, '');

			UpdateBusinessServer(data, function (values, response) {
				$.growl({
					title : "RoloMax",
					message : "Business Updated..",
					style : "notice"
				});
				data = {
					Filter : ''
				};

				LoadAllBusiness(data);
			});
		}
	}

	function DeleteBusiness(element, data) {
		var y = element.closest('li');
		DeleteBusinessServer(data, function (values, response) {
			y.remove();
			$.growl({
				title : "RoloMax",
				message : "Business Deleted..",
				style : "notice"
			});

			data = {
				Filter : ''
			};

			LoadAllBusiness(data);
		});
	}

	$(document).ready(function () {

		var storeData = $('#storedData')[0];

		$.ajaxPrefilter(function (options, orig, xhr) {

			if (options.processData
				 && /^application\/json((\+|;).+)?$/i.test(options.contentType)
				 && /^(post|put|delete)$/i.test(options.type)) {
				options.data = JSON.stringify(orig.data);
			}
		});

		$("body").delegate("#contactSave", "click", function () {
			var form = $('#create').find('form');
			var values = can.deparam(form.serialize());
			CreateContactServer(values, function (result) {
				$('#create').slideUp();
				LoadContacts($.data($("#storedData")[0], 'business'));
				$.growl({
					title : "RoloMax",
					message : "Contact Created..",
					style : "notice"
				});
			});
		});

		$("body").delegate("#userSave", "click", function () {
			var form = $('#createUser').find('form');
			var values = can.deparam(form.serialize());
			CreateUserDefinedServer(values, function (result) {
				$('#createUser').slideUp();
				data.Business = $.data($("#storedData")[0], 'business');
				data.Contact = $.data($("#storedData")[0], 'contact');
				LoadUserDefined(data);
				$.growl({
					title : "RoloMax",
					message : "User Defined Created..",
					style : "notice"
				});
			});
		});

		$("body").delegate("#contactCancel", "click", function () {
			HideAddContact();
		});

		$("body").delegate("#businessSave", "click", function () {
			var form = $('#createBusiness').find('form');
			var data = can.deparam(form.serialize());

			data.BPhone1 = data.BPhone1.replace(/\D/g, '');
			data.BPhone2 = data.BPhone2.replace(/\D/g, '');

			var x = new Parsley(form);
			var valid = x.validate();

			if (valid) {

				CreateBusinessServer(data, function (result, response) {
					$('#businessCreate').slideUp();
					HideAddBusiness();
					$.growl({
						title : "RoloMax",
						message : "Business Created..",
						style : "notice"
					});
					data = {
						Filter : ''
					};

					LoadAllBusiness(data);

				});
			}
		});

		$("body").delegate(".expander", "click", function () {
			$(this).toggleClass("businessExpand", 0, "businessShrink").toggleClass("businessShrink", 0, "businessExpand");
			if ($(this).hasClass("businessShrink")) {
				$(this).next('li').slideDown(200);
			}
			if ($(this).hasClass("businessExpand")) {
				$(this).next('li').slideUp(200);
			}

		});

		$("body").delegate("#businessCancel", "click", function () {
			HideAddBusiness();
		});

		$("body").delegate("#userCancel", "click", function () {
			HideAddUser();
		});

		$("#filter").delegate(".businessHeader a", "click", function () {

			$("#filter li").removeClass('active');
			var x = $(this).closest('li').addClass('active');
			//store data in dom
			$.data($("#storedData")[0], "business", $(this).attr('data-category'));

			LoadContacts($(this).attr('data-category'));

		});

		$('#contacts').delegate("li", "click", function () {

			var data = {};
			$("#contacts li").removeClass('active');
			var x = $(this).addClass('active');

			//store data in dom
			$.data($("#storedData")[0], "contact", $(this).find('input[name=CConId').val());

			data.Business = $.data($("#storedData")[0], 'business');
			data.Contact = $.data($("#storedData")[0], 'contact');

			LoadUserDefined(data);
		});

		$('#users').delegate("li", "click", function () {

			var data = {};
			$("#contacts li").removeClass('active');
			var x = $(this).addClass('active');

			//store data in dom
			$.data($("#storedData")[0], "user", $(this).find('input[name=UUsrId').val());

		});

		$("body").delegate("#new-contact", "click", function () {
			ShowAddContact();
		});

		$("body").delegate("#new-business", "click", function () {
			ShowAddBusiness();
		});

		$("body").delegate("#new-user", "click", function () {
			ShowAddUser();
		});

		$("body").delegate("#contacts .inputEdit", "change", function () {
			var form = $(this).closest('form');
			data = can.deparam(form.serialize());
			UpdateContactServer(data, function (values) {
				$.growl({
					title : "RoloMax",
					message : "Contact Updated..",
					style : "notice"
				});
			});
		});

		$("body").delegate("#users .inputEdit", "change", function () {
			var form = $(this).closest('form');
			data = can.deparam(form.serialize());
			UpdateUserDefinedServer(data, function (values, response) {
				console.log(response);
				console.log(values);
				$.growl({
					title : "RoloMax",
					message : "User Defined Updated..",
					style : "notice"
				});
			});
		});

		$("body").delegate(".remove", "click", function () {
			var data;

			var x = $(this).closest('li').find('input[name="CConId"]').val();
			var y = $(this).closest('li');
			data = {
				Contact : x
			};
			DeleteContactServer(data, function (values) {
				y.remove();
				$.growl({
					title : "RoloMax",
					message : "Contact Deleted..",
					style : "notice"
				});
			});
		});

		$("body").delegate(".userRemove", "click", function () {
			var data = {};
			var y = $(this).closest('li');
			data = {
				User : data.Contact = $.data($("#storedData")[0], 'user')
			};
			DeleteUserServer(data, function (values, response) {
				console.log(values, response);
				y.remove();
				$.growl({
					title : "RoloMax",
					message : "User Deleted..",
					style : "notice"
				});
			});
		});

		$("#search-business").click(function () {
			var data = {};
			data.Filter = $('#search_box').val();
			LoadAllBusiness(data);
		});

	});

})();
