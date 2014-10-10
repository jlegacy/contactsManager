(function () {

	/*UserDefined = can.Model.extend({
	findAll : 'GET /userDefined/{CBusId}{CConId}',
	find: 'GET /userDefined/{CBusId}{CConId}{UField}'
	create : "POST /userDefined",
	update : "PUT /userDefined/{CBusId}{CConId}{UField}",
	destroy : "DELETE /userDefined/{CBusId}{CConId}{UField}",
	id : "U"
	}, {}); */

	Contact = can.Model.extend({
			findContacts : function (data, callback) {
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
			},

			CreateContactServer : function (data, callback) {
				//get business id
				data.CBusId = can.route.attr('category');
				//create unique contact id
				data.CConId = createGuid();
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

			},

			

			DeleteContactServer : function (data, callback) {
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
			},

		}, {});

	Contact.List = can.Model.List({
			filter : function (category) {
				this.attr('length');
				var contacts = new Contact.List([]);
				this.each(function (contact, i) {
					if (category === 'all' || category === contact.attr('CBusId')) {
						contacts.push(contact)
					}
				})
				return contacts;
			},
			count : function (category) {
				return this.filter(category).length;
			}
		
		});

	Category = can.Model.extend({
			findAllBusiness : function (data, callback) {
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
		}, {});

	Contacts = can.Control({

			deleteContact : function (el) {
				var data;
				var x = el.closest('li').find('input[name="CConId"]').val();
				data = {
					Contact : x
				};
				Contact.DeleteContactServer(data, function (values) {
					$.growl({
						title : "RoloMax",
						message : "Contact Deleted..",
						style : "notice"
					});
				});
				el.closest('li').remove();
			},
			updateContact : function (el) {
				var form = el.closest('form');
				data = can.deparam(form.serialize());
				Contact.UpdateContactServer(data, function (values) {
					$.growl({
						title : "RoloMax",
						message : "Contact Updated..",
						style : "notice"
					});
				});
			},

			

			'.remove click' : function (el, ev) {
				this.deleteContact(el);
			},

			'{Contact} created' : function (list, ev, contact) {
				this.options.contacts.push(contact);
			}

		});

	Create = can.Control({

			createMyContacts : function (el) {
				var form = this.element.find('form');
				values = can.deparam(form.serialize());
				Contact.CreateContactServer(values, function (result) {
				//	$(this).attr('data-category')
					$('#create').hide();
					$.growl({
						title : "RoloMax",
						message : "Contact Created..",
						style : "notice"
					});
				});
			}
			
			

			
		});

	
		

	function LoadBusiness(data) {
		var category = can.route.attr('category') || "all";
		$('#filter').html(can.view('views/filterView.ejs', {
				categories : data
			}));
	}

	
	
	
	
	function LoadContacts(data) {
		Contact.findContacts({
			Business : data
		}, function (data) {
			var j = {contacts : data};
			$('#contacts').html("");
			$('#contacts').html(can.view('views/contactsList.ejs', {contacts : data}));
		});
	}
	
	function ShowAddContact() {
				var x = (can.view('views/createView.ejs', {
						contact : {},
						categories : {},
					}));
	
				$('#create').empty();
				$('#create').hide();
				$('#create').append(x);
				$('#create').slideDown();
				
			}
			
			
	function HideAddContact () {
				$('#create').slideUp();
	}

	$(document).ready(function () {

		$.ajaxPrefilter(function (options, orig, xhr) {

			if (options.processData
				 && /^application\/json((\+|;).+)?$/i.test(options.contentType)
				 && /^(post|put|delete)$/i.test(options.type)) {
				options.data = JSON.stringify(orig.data);
			}
		});
		
		
		$("body").delegate(".save", "click", function () {
			alert('need to call CreateMyContacts');
		});
		
		$("body").delegate(".cancel", "click", function () {
			HideAddContact();
			
		});
		
	
			
		$("nav").delegate("a", "click", function () {
			LoadContacts($(this).attr('data-category'));
		});
			
			
		$("body").delegate("#new-contact", "click", function () {
			ShowAddContact();
		});
		
		$("body").delegate(".inputEdit", "change", function () {
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
		
		function UpdateContactServer (data, callback) {
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
		
		
		//$('contact input change' : function (el, ev) {
		//		this.updateContact(el);
		//	},
		
		data = {Filter : ''}; 
		Category.findAllBusiness(data, function(response) {
		LoadBusiness(response);
		
		// update perfect scrollbar
				jQuery('.scrollbar-vista').scrollbar({
					"showArrows" : true,
					"type" : "advanced"
				});
		});

		Category.findAll({
			Filter : ''
		}, function (response, request) {
			if (request === 'success') {

				

				var categories = response;

				new Create('#create', {
					categories : categories
				});
				new Filter('#filter', {
					contacts : contacts,
					categories : categories
				});
				new Contacts('#contacts', {
					contacts : contacts,
				});

				
			}

		});
	});

})();
