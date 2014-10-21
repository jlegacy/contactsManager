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

		can.view.cache = false;
		$('#filter').html(can.view('views/filterView.ejs', {
				categories : data
			}));
	}

	function LoadContacts(data) {
		can.view.cache = false;
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
			//Set Up Phone Mask on All Phone Numbers//
			SetUpContactsEditMask();

			$('#contacts').off();

			$(".updateContactButton").button({
				icons : {
					primary : "ui-icon-gear",
					secondary : "ui-icon-triangle-1-s"
				}
			});
			$(".deleteContactButton").button({
				icons : {
					primary : "ui-icon-gear",
					secondary : "ui-icon-triangle-1-s"
				}
			});

			$("body").off("click", ".updateContactButton");
			$("body").delegate(".updateContactButton", "click", function () {

				event.preventDefault();
				var form = $(this).closest('form');

				data = can.deparam(form.serialize());
				data.CPhone1 = data.CPhone1.replace(/\D/g, '');
				data.CPhone2 = data.CPhone2.replace(/\D/g, '');

				var x = new Parsley(form);
				var valid = x.validate();

				if (valid) {
					UpdateContactServer(data, function (response) {
						if (response) {
							$.growl({
								title : "RoloMax",
								message : "Contact Updated..",
								style : "notice"
							});
						} else {
							$.growl({
								title : "RoloMax",
								message : "Error Updating Contact..",
								style : "warning"
							});

						}
					});
				}
			});

			$("body").off("click", ".deleteContactButton");
			$(".deleteContactButton").click(function (event) {
				var element = $(this);
				event.preventDefault();
				var data = {};
				$("#ContactDeleteConfirm").dialog({
					modal : true,
					draggable : false,
					resizable : false,
					position : ['center', 'center'],
					show : 'blind',
					hide : 'blind',
					width : 400,
					dialogClass : 'ui-dialog-osx',
					buttons : {
						"Confirm" : function () {
							data.Contact = element.attr('id');
							DeleteContact(data);
							$(this).dialog("close");
						},
						"Cancel" : function () {
							$(this).dialog("close");
						}
					}
				});

			});

			$('#showAllContacts').removeClass('expandLogo').addClass('shrinkLogo');

			$('#contacts').on("click", "li", function () {

				var data = {};
				$("#contacts li").removeClass('active');
				var x = $(this).addClass('active');

				//store data in dom
				$.data($("#storedData")[0], "contact", $(this).find('input[name=CConId').val());

				data.Business = $.data($("#storedData")[0], 'business');
				data.Contact = $.data($("#storedData")[0], 'contact');

				$('.contact').not('.active').slideUp(200);

				$('#showAllContacts').removeClass('shrinkLogo');
				$('#showAllContacts').addClass('expandLogo');

				LoadUserDefined(data);

				$("html, body").animate({
					scrollTop : 0
				}, "slow");
			});
		});
	}

	function LoadUserDefined(data) {
		can.view.cache = false;
		GetUserServer(data, function (data) {

			$('#users').html("");
			$('#users').html(can.view('views/userList.ejs', {
					user : data
				}));

			$('#users').off();

			$(".updateUserButton").button({
				icons : {
					primary : "ui-icon-gear",
					secondary : "ui-icon-triangle-1-s"
				}
			});

			$(".deleteUserButton").button({
				icons : {
					primary : "ui-icon-gear",
					secondary : "ui-icon-triangle-1-s"
				}
			});

			$(".updateUserButton").click(function (event) {
				event.preventDefault();

				var form = $(this).closest('form');
				var x = new Parsley(form);
				var valid = x.validate();

				if (valid) {
					data = can.deparam(form.serialize());
					UpdateUserDefinedServer(data, function (values, response) {
						if (response) {
							$.growl({
								title : "RoloMax",
								message : "User Defined Updated..",
								style : "notice"
							});
						} else {
							$.growl({
								title : "RoloMax",
								message : "Error Updating User..",
								style : "warning"
							});
						}
					});
				}

			});

			$(".deleteUserButton").click(function (event) {

				var element = $(this);
				event.preventDefault();
				var data = {};
				$("#UserDeleteConfirm").dialog({
					modal : true,
					draggable : false,
					resizable : false,
					position : ['center', 'center'],
					show : 'blind',
					hide : 'blind',
					width : 400,
					dialogClass : 'ui-dialog-osx',
					buttons : {
						"Confirm" : function () {
							var data = {};
							data = {
								User : data.Contact = $.data($("#storedData")[0], 'user')
							};

							$(this).dialog("close");
							DeleteUserServer(data, function (values, response) {
								if (response) {
									$.growl({
										title : "RoloMax",
										message : "User Defined Deleted..",
										style : "notice"
									});
								} else {
									$.growl({
										title : "RoloMax",
										message : "Error Deleting User Defined..",
										style : "warning"
									});
								}

								data = {};
								data.Business = $.data($("#storedData")[0], 'business');
								data.Contact = $.data($("#storedData")[0], 'contact');
								LoadUserDefined(data);
							});
						},
						"Cancel" : function () {
							$(this).dialog("close");
						}
					}
				});

			});

		//	var datepicker = $('input[name="UField"]').data('Zebra_DatePicker');
		//	datepicker.destroy();

			$('input[name="UField"]').Zebra_DatePicker({
				readonly_element : false,
			});

			$('#users').off();
			$('#users').on("click", "li", function () {
				var data = {};

				//store data in dom
				$.data($("#storedData")[0], "user", $(this).find('input[name=UUsrId').val());

			});

		});
	}

	function ShowAddContact() {
		can.view.cache = false;

		var data = {};

		data.CConId = createGuid();
		data.CBusId = $('#filter').find('.active').find('a').attr('data-category')

			if (data.CBusId) {}
			else {
				$.growl({
					title : "Error",
					message : "Select Business First..",
					style : "error"
				});
				return;
			}

			var x = (can.view('views/createView.ejs', {
					contact : data,
					categories : {},
				}));

		$('#create').empty();
		$('#create').hide();
		$('#create').append(x);
		$('#create').slideDown();

		$('#contactButtonBar').hide();

		SetUpContactsEditMask();

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

	function SetUpContactsEditMask() {
		//Set Up Phone Mask on All Phone Numbers//
		var dateBoxes = $("input[name='CPhone1']");
		dateBoxes.mask("(999) 999-9999");

		var dateBoxes = $("input[name='CPhone2']");
		dateBoxes.mask("(999) 999-9999");
	}

	function ShowAddBusiness() {
		can.view.cache = false;

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
		can.view.cache = false;

		var data = {};

		data.UUsrId = createGuid();
		data.UBusId = $.data($("#storedData")[0], 'business');
		data.UConId = $.data($("#storedData")[0], 'contact');

		if ((data.UBusId) && (data.UConId)) {}
		else {
			$.growl({
				title : "Error",
				message : "Select Business and Contact First..",
				style : "error"
			});
			return;
		}

		var x = (can.view('views/createUser.ejs', {
				user : data
			}));

		$('#createUser').empty();
		$('#createUser').hide();
		$('#createUser').append(x);
		$('#createUser').slideDown();

	//	var datepicker = $('input[name="UField"]').data('Zebra_DatePicker');
	//	datepicker.destroy();

		$('input[name="UField"]').Zebra_DatePicker({
			readonly_element : false,
		});

		$('#userButtonBar').hide();
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
			cache : false,
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
			cache : false,
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

		$('#contacts').html('');
		$('#users').html('');
		$('#create').slideUp(200);
		$('#createUser').slideUp(200);

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
				}

			});

			$(".deleteBusinessButton").click(function (event) {
				event.preventDefault();
				var element = $(this);
				var data = {};
				$("#BusinessDeleteConfirm").dialog({
					modal : true,
					draggable : false,
					resizable : false,
					position : ['center', 'center'],
					show : 'blind',
					hide : 'blind',
					width : 400,
					dialogClass : 'ui-dialog-osx',
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

			$("#filter").off();

			$("#filter").on("click", ".expander", function () {
				$(this).toggleClass("expandLogo", 0, "shrinkLogo").toggleClass("shrinkLogo", 0, "expandLogo");
				if ($(this).hasClass("shrinkLogo")) {
					$(this).next('li').slideDown(200);
				}
				if ($(this).hasClass("expandLogo")) {
					$(this).next('li').slideUp(200);
				}

			});

			$("#filter").on("click", ".businessHeader a", function () {

				$("#filter li").removeClass('active');
				var x = $(this).closest('li').addClass('active');
				//store data in dom
				$.data($("#storedData")[0], "business", $(this).attr('data-category'));

				LoadContacts($(this).attr('data-category'));

				$.data($("#storedData")[0], "contact", '');

				$('#users').html("");
			});

		});
	}

	function GetSearchBox() {
		return $('#search_box').val();
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
				if (response) {
					$.growl({
						title : "RoloMax",
						message : "Business Updated..",
						style : "notice"
					});
				} else {
					$.growl({
						title : "RoloMax",
						message : "Error Updating Business..",
						style : "warning"
					});
				}
				data = {
					Filter : GetSearchBox()
				};

				LoadAllBusiness(data);
			});
		}
	}

	function ConvertPhoneNumber(data) {
		var s2 = ("" + s).replace(/\D/g, '');
		var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
		return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
	}

	function DeleteBusiness(element, data) {
		var y = element.closest('li');
		DeleteBusinessServer(data, function (values, response) {
			y.remove();
			if (response) {
				$.growl({
					title : "RoloMax",
					message : "Business Deleted..",
					style : "notice"
				});
			} else {
				$.growl({
					title : "RoloMax",
					message : "Error Deleting Business..",
					style : "warning"
				});
			}

			data = {
				Filter : GetSearchBox()
			};

			LoadAllBusiness(data);
		});
	}

	function DeleteContact(data) {
		DeleteContactServer(data, function (response) {

			LoadContacts($.data($("#storedData")[0], 'business'));

			if (response) {
				$.growl({
					title : "RoloMax",
					message : "Contact Deleted..",
					style : "notice"
				});
			} else {
				$.growl({
					title : "RoloMax",
					message : "Error Deleting Contact..",
					style : "notice"
				});
			}

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

		$("#showAllContacts").click(function () {

			$(this).toggleClass("expandLogo", 0, "shrinkLogo").toggleClass("shrinkLogo", 0, "expandLogo");
			if ($(this).hasClass("shrinkLogo")) {
				$('.contact').slideDown(200);
			}
			if ($(this).hasClass("expandLogo")) {
				$('.contact').not('.active').slideUp(200);
			}
		});

		$("body").on("click", "#contactSave", function () {
			var form = $('#create').find('form');

			var data = can.deparam(form.serialize());
			data.CPhone1 = data.CPhone1.replace(/\D/g, '');
			data.CPhone2 = data.CPhone2.replace(/\D/g, '');

			var x = new Parsley(form);
			var valid = x.validate();

			if (valid) {
				CreateContactServer(data, function (response) {
					$('#create').slideUp();
					LoadContacts($.data($("#storedData")[0], 'business'));
					if (response) {
						$.growl({
							title : "RoloMax",
							message : "Contact Created..",
							style : "notice"
						});
					} else {
						$.growl({
							title : "RoloMax",
							message : "Error Creating Contact..",
							style : "warning"
						});
					}
				});
			}
		});

		$("body").on("click", "#userSave", function () {
			var form = $('#createUser').find('form');
			var data = {};
			var values = can.deparam(form.serialize());
			CreateUserDefinedServer(values, function (response) {
				$('#createUser').slideUp();
				data.Business = $.data($("#storedData")[0], 'business');
				data.Contact = $.data($("#storedData")[0], 'contact');
				LoadUserDefined(data);
				if (response) {
					$.growl({
						title : "RoloMax",
						message : "User Defined Created..",
						style : "notice"
					});
				} else {
					$.growl({
						title : "RoloMax",
						message : "Error Creating User Defined..",
						style : "warning"
					});
				}
			});
		});

		$("body").on("click", "#contactCancel", function () {
			HideAddContact();
		});

		$("body").on("click", "#businessSave", function () {
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
					if (response) {
						$.growl({
							title : "RoloMax",
							message : "Business Created..",
							style : "notice"
						});
					} else {
						$.growl({
							title : "RoloMax",
							message : "Error Creating Business..",
							style : "warning"
						});
					}
					data = {
						Filter : GetSearchBox()
					};

					LoadAllBusiness(data);

				});
			}
		});

		$("body").on("click", "#businessCancel", function () {
			HideAddBusiness();
		});

		$("body").on("click", "#userCancel", function () {
			HideAddUser();
		});

		$("body").on("click", "#new-contact", function () {

			ShowAddContact();
		});

		$("body").on("click", "#new-business", function () {
			ShowAddBusiness();
		});

		$("body").on("click", "#new-user", function () {
			ShowAddUser();
		});

		$("#search-business").click(function () {
			var data = {};
			data.Filter = GetSearchBox()
				LoadAllBusiness(data);
			$('#contacts').html('');
			$('#users').html('');
			$('#create').slideUp(200);
			$('#createUser').slideUp(200);
			$.data($("#storedData")[0], "business", '');
			$.data($("#storedData")[0], "user", '');
			$.data($("#storedData")[0], "contact", '');

		});

		can.view.cache = false;

	});

})();
