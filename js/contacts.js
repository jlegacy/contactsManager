(function () {

	var USER_DEFINED = [{
			UBusId : 1,
			UConId : 1,
			UField : 'TestField1',
			UItem : 'TestComments',
			UType : 'date'
		}, {
			UBusId : 1,
			UConId : 1,
			UField : 'TestField2',
			UItem : 'william@husker.com',
			UType : 'text'
		}, {
			UBusId : 1,
			UConId : 2,
			UField : 'TestField3',
			UItem : 'TestItem',
			UType : 'text',
		}
	];

	var CONTACTS = [{
			CBusId : 1,
			CConId : 1,
			CFirstName : 'William1',
			CLastName : 'Test1',
			CPosition : 'admin',
			CPhone1 : '0123456789',
			CPhone2 : '0123456789',
			CPhone1Fax : 'Y',
			CPhone2Fax : 'Y',
			CEmail : 'test1@test.com'
		}, {
			CBusId : 2,
			CConId : 2,
			CFirstName : 'William2',
			CLastName : 'Test2',
			CPosition : 'admin',
			CPhone1 : '0123456789',
			CPhone2 : '0123456789',
			CPhone1Fax : 'Y',
			CPhone2Fax : 'Y',
			CEmail : 'test1@test.com'
		}, {
			CBusId : 3,
			CConId : 3,
			CFirstName : 'William3',
			CLastName : 'Test3',
			CPosition : 'admin',
			CPhone1 : '0123456789',
			CPhone2 : '0123456789',
			CPhone1Fax : 'Y',
			CPhone2Fax : 'Y',
			CEmail : 'test1@test.com'
		}
	];

	var CATEGORIES = [{
			BBusId : 1,
			BName : 'test1',
			BAddress : '1 CanJS Way',
			BCity : 'Greenville',
			BState : 'NC',
			BZip : '27812',
			BPhone1 : '4444444444',
			BPhone2 : '5555555555',
			BPhone1Fax : 'N',
			BPhone2Fax : 'Y',
			BEmail : 'test1@husker.com'
		}, {
			BBusId : 2,
			BName : 'test2',
			BAddress : '1 CanJS Way',
			BCity : 'Greenville',
			BState : 'NC',
			BZip : '27812',
			BPhone1 : '4444444444',
			BPhone2 : '5555555555',
			BPhone1Fax : 'N',
			BPhone2Fax : 'Y',
			BEmail : 'test2@husker.com'
		}, {
			BBusId : 3,
			BName : 'test3',
			BAddress : '1 CanJS Way',
			BCity : 'Greenville',
			BState : 'NC',
			BZip : '27812',
			BPhone1 : '4444444444',
			BPhone2 : '5555555555',
			BPhone1Fax : 'N',
			BPhone2Fax : 'Y',
			BEmail : 'test3@husker.com'
		}
	];

	/*UserDefined = can.Model.extend({
	findAll : 'GET /userDefined/{CBusId}{CConId}',
	find: 'GET /userDefined/{CBusId}{CConId}{UField}'
	create : "POST /userDefined",
	update : "PUT /userDefined/{CBusId}{CConId}{UField}",
	destroy : "DELETE /userDefined/{CBusId}{CConId}{UField}",
	id : "U"
	}, {}); */
	
	
	Contact = can.Model.extend({ 
			findContacts : function(data, callback)
			{
					$.ajax({
					type: "GET",
					url: "/ContactsManager/Service1.svc/GetContacts",
					data: data,
					contentType: "application/json; charset=utf-8", 
					dataType: 'json',
					})
				.done(function( result ) {
				    callback(result);
					});
				},
				
			CreateContactServer: function(data, callback)
			{
			//get business id 
			data.CBusId = can.route.attr('category');
			//create unique contact id
			data.CConId = createGuid();
				$.ajax({
					type: "POST",
					url: "/ContactsManager/Service1.svc/AddContact",
					data: data,
					contentType: "application/json; charset=utf-8", 
					dataType: 'json',
					})
				.done(function( result ) {
				    callback(result);
					});
			
			},
			
			UpdateContactServer: function(data,callback)
			{
				$.ajax({
					type: "POST",
					url: "/ContactsManager/Service1.svc/UpdateContact",
					data: data,
					contentType: "application/json; charset=utf-8", 
					processData: true,
					dataType: 'json',
					})
				.done(function( result ) {
				    callback(result);
					});
				},
			
			
			DeleteContactServer: function(data,callback)
			{
				$.ajax({
					type: "GET",
					url: "/ContactsManager/Service1.svc/DeleteContact",
					data: data,
					contentType: "application/json; charset=utf-8", 
					processData: true,
					dataType: 'json',
					})
				.done(function( result ) {
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
			},
			filter : function (contacts) {
				alert('In Route');
			},
		});

	Category = can.Model.extend({
			findAll : function(params){
				return $.get('../ContactsManager/Service1.svc/GetBusiness/', params)
				},
			id : 'BBusId'
		}, {});

	can.fixture('GET /contacts', function () {
		return [CONTACTS];
	});

	// create
	var id = 4;
	can.fixture("POST /contacts", function () {
		// just need to send back a new id
		return {
		CBusId : 1,
			CConId : (id++)
		}
	});

	// update
	can.fixture("PUT /contacts/{CConId}", function () {
		// just send back success
		return {};
	});

	// destroy
	can.fixture("DELETE /contacts/{CConId}", function () {
		// just send back success
		return {};
	});

	can.fixture('GET /categories', function () {
		return [CATEGORIES];
	});

	can.route('filter/:category');
	
	Contacts = can.Control({
	
			deleteContact : function (el) {
			    var data;
				var x = el.closest('li').find('input[name="CConId"]').val();
				data = {Contact: x};
				Contact.DeleteContactServer(data, function(values) {
				$.growl({ 
							title: "RoloMax", 
							message: "Contact Deleted..",
							style: "notice"});
				});
				el.closest('li').remove();
			},
			updateContact : function (el) {
				var form = el.closest('form');
				data = can.deparam(form.serialize());
				Contact.UpdateContactServer(data, function(values) {
				$.growl({ 
							title: "RoloMax", 
							message: "Contact Updated..",
							style: "notice"});
				});
			},

			'.contact input change' : function (el, ev) {
				this.updateContact(el);
			},
		
			'.remove click' : function (el, ev) {
			  this.deleteContact(el);
			},
			
			'{Contact} created' : function (list, ev, contact) {
				this.options.contacts.push(contact);
			}
			
		
			
		});

	Create = can.Control({
	
			createMyContacts : function(el)
			{
			var form = this.element.find('form');
				values = can.deparam(form.serialize());
				Contact.CreateContactServer(values, function (result) {
				$('#create').hide();
				
				//
				
				//
				
				
				'[data-category] click'
				$.growl({title: "RoloMax", message: "Contact Updated..",style: "notice"});
				});
			},
			show : function () {
				this.contact = new Contact();
				this.element.html(can.view('views/createView.ejs', {
						contact : this.contact,
						categories : this.options.categories,
					}));
				this.element.slideDown(200);
			},
			hide : function () {
				this.element.slideUp(200);
			},
			'{document} #new-contact click' : function () {
				this.show();
			},
		
			'.save click' : function (el) {
			//el.attr('Name', 'CConId') = createGuid();
			this.createMyContacts(el);
			},
			'.cancel click' : function () {
				this.hide();
			}
		});

	Filter = can.Control({
			init : function () {
				var category = can.route.attr('category') || "all";
				this.element.html(can.view('views/filterView.ejs', {
						contacts : this.options.contacts,
						categories : this.options.categories
					}));
				this.element.find('[data-category="' + category + '"]').parent().addClass('active');
			},
			'[data-category] click' : function (el, ev) {
				this.element.find('[data-category]').parent().removeClass('active');
				el.parent().addClass('active');
				can.route.attr('category', el.data('category'));
				this.LoadContacts();
			},
			
			LoadContacts : function () {
			Contact.findContacts({Business:can.route.attr('category')}, function(data) {
				var j = {contacts : data};
				$('#contacts').html("");
				$('#contacts').html(can.view('views/contactsList.ejs', {contacts : data}));
			});
			},
		
		});
		
	$(document).ready(function () {
	
	$.ajaxPrefilter(function(options, orig, xhr ) { 

  if ( options.processData
    && /^application\/json((\+|;).+)?$/i.test( options.contentType )
    && /^(post|put|delete)$/i.test( options.type )
  ) {       
    options.data = JSON.stringify( orig.data );
  }
}); 
	
			Category.findAll({Filter:''}, function (response, request) {
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

			// update perfect scrollbar
			jQuery('.scrollbar-vista').scrollbar({
				"showArrows" : true,
				"type" : "advanced"
			});
			}

		});
	});
	

})();