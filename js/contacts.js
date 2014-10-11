(function () {

	/*UserDefined = can.Model.extend({
	findAll : 'GET /userDefined/{CBusId}{CConId}',
	find: 'GET /userDefined/{CBusId}{CConId}{UField}'
	create : "POST /userDefined",
	update : "PUT /userDefined/{CBusId}{CConId}{UField}",
	destroy : "DELETE /userDefined/{CBusId}{CConId}{UField}",
	id : "U"
	}, {}); */

	function LoadBusiness(data) {
		var category = can.route.attr('category') || "all";
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

	}

	function HideAddBusiness() {
		$('#createBusiness').slideUp();
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

	function findAllBusiness(data, callback) {
		$.ajax({
			type : "GET",
			url : "../ContactsManager/Service1.svc/GetBusiness/",
			data : data,
			contentType : "application/json; charset=utf-8",
			dataType : 'json',
		})
		.done(function (result) {
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

	$(document).ready(function () {

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
				LoadContacts($('#filter').find('.active').find('a').attr('data-category'));
				$.growl({
					title : "RoloMax",
					message : "Contact Created..",
					style : "notice"
				});
			});
		});

		$("body").delegate("#contactCancel", "click", function () {
			HideAddContact();
		});

		$("body").delegate("#businessSave", "click", function () {
			var form = $('#createBusiness').find('form');
			var values = can.deparam(form.serialize());
			CreateBusinessServer(values, function (result, response) {
				$('#businessCreate').slideUp();
				HideAddBusiness();
				$.growl({
					title : "RoloMax",
					message : "Business Created..",
					style : "notice"
				});
			});
		});

		$("body").delegate("#businessCancel", "click", function () {
			HideAddBusiness();
		});

		$("nav").delegate("a", "click", function () {
			$("#section-navigation li").removeClass('active');
			var x = $(this).closest('li').addClass('active');
			LoadContacts($(this).attr('data-category'));
		});

		$('#contacts').delegate("li", "click", function () {
			var data = {};
			$("#contacts li").removeClass('active');
			var x = $(this).addClass('active');

			data.Business = $(this).find('input[name=CBusId').val();
			data.Contact = $(this).find('input[name=CConId').val();
			
			LoadUserDefined(data);
		});

		$("body").delegate("#new-contact", "click", function () {
			ShowAddContact();
		});

		$("body").delegate("#new-business", "click", function () {
			ShowAddBusiness();
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

		$("body").delegate("#filter .inputEdit", "change", function () {
			var form = $(this).closest('form');
			data = can.deparam(form.serialize());
			UpdateBusinessServer(data, function (values, response) {
				console.log(response);
				console.log(values);
				$.growl({
					title : "RoloMax",
					message : "Business Updated..",
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

		$("body").delegate(".businessRemove", "click", function () {
			var data;

			var x = $(this).closest('li').find('input[name="BBusId"]').val();
			var y = $(this).closest('li');
			data = {
				Business : x
			};
			DeleteBusinessServer(data, function (values, response) {
				console.log(values, response);
				y.remove();
				$.growl({
					title : "RoloMax",
					message : "Business Deleted..",
					style : "notice"
				});
			});
		});

		data = {
			Filter : ''
		};
		findAllBusiness(data, function (response) {

			LoadBusiness(response);

			// update perfect scrollbar
			jQuery('.scrollbar-vista').scrollbar({
				"showArrows" : true,
				"type" : "advanced"
			});
		});

	});

})();
