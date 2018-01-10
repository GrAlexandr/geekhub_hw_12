let contacts = [];
jQuery(function ($) {
	$('#submit').on('click', addContact);
	$('#hide-contacts').on('click', hideContactForm);
	$('#hide-contacts').on('click', hideCheckBoxes);
	getContacts(contacts);
});

function getContacts() {
	$.get('/api/v1/contacts', function (data) {
		contacts = data.contacts;
		renderContact(contacts);
	})
}

function renderContact(allContact) {
	allContact.forEach(function (element) {
		createContact(element);
	})
}

function createContact(element) {
	if (element.name !== '' && element.phone !== '') {
		let li = document.createElement('li');
		li.innerText = element.name + ' ' + element.phone;
		li.setAttribute('id', `${element._id}`);

		let del = document.createElement('span');
		del.addEventListener('click', removeContact);
		del.setAttribute('class', 'btn btn-danger btn-xs glyphicon glyphicon-trash');

		let edit = document.createElement('span');
		edit.addEventListener('click', editContact);
		edit.addEventListener('click', hideCheckBoxes);

		edit.setAttribute('class', 'btn btn-warning btn-xs glyphicon glyphicon-pencil');

		li.append(edit);
		li.append(del);
		$('#contacts').append(li);
	}
}

function isCheced() {
	let group = ['All'];
	let checkBoxes = document.querySelectorAll('input[type=checkbox]');
	checkBoxes.forEach(function (element) {
		if (element.checked === true) {
			group.push(element.value);
		}
	});
	return group;
}

function addContact() {
	let group = isCheced();

	let element = {
		name: $('#name').val(),
		phone: $('#phone').val(),
		category: group
	};

	$.ajax({
		url: '/api/v1/contacts',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(element),
		dataType: 'json',
	});
}

function removeContact(e) {
	$.ajax({
		url: `/api/v1/contact/${e.target.parentElement.id}`,
		type: 'DELETE',
		dataType: 'json'
	});
	$(`#${e.target.parentElement.id}`).remove();

	let deletedElement = {};
	for (let i = 0; i < contacts.length; i ++) {
		if (contacts[i]._id === e.target.parentElement.id) {
			deletedElement = contacts[i];
		}
	}
	contacts.splice(contacts.indexOf(deletedElement, 1));
}

function editContact(e) {
	let contactText = e.target.parentElement.innerText;
	let li = e.target.parentElement.cloneNode(true);

	let contact = {
		category: [],
		_id: e.target.parentElement.id,
		name: contactText.split(' ')[0],
		phone: contactText.split(' ')[1]
	};

	for (let i = 0; i < contacts.length; i++) {
		if (contacts[i]._id === e.target.parentElement.id) {
			contact.category = contacts[i].category;
		}
	}

	document.querySelectorAll('input[type=checkbox]').forEach(function (element) {
		if (contact.category.includes(element.value)) {
			element.checked = true;
		}
		element.nextElementSibling.classList.add('checkBoxEdit');
	});

	let contactDiv = document.createElement('form');
	let name = document.createElement('input');
	let phone = document.createElement('input');
	let save = document.createElement('button');

	save.setAttribute('class', 'btn btn-primary ');
	save.innerText = 'Save';

	name.setAttribute('type', 'text');
	name.setAttribute('class', 'form-control');
	name.setAttribute('id', 'editName');
	name.value = contact.name;

	phone.setAttribute('type', 'text');
	phone.setAttribute('class', 'form-control');
	phone.setAttribute('id', 'editPhone');
	phone.value = contact.phone;

	contactDiv.append(name);
	contactDiv.append(phone);
	contactDiv.append(save);


	save.addEventListener('click', function (event) {
		event.preventDefault();
		let group = isCheced();
		let editName = $('#editName').val();
		let editPhone = $('#editPhone').val();

		if (editName !== '' && editPhone !== '') {
			$.ajax({
				url: `/api/v1/contact/${e.target.parentElement.id}`,
				type: 'PUT',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify({
					name: editName,
					phone: editPhone,
					category: group
				})
			});

			let editBtn = li.querySelector('.btn-warning');
			editBtn.addEventListener('click', editContact);
			editBtn.addEventListener('click', hideCheckBoxes);
			li.querySelector('.btn-danger').addEventListener('click', removeContact);
			li.childNodes[0].data = (editName + ' ' +editPhone).toString();
			for (let i = 0; i < contacts.length; i++) {
				if (contacts[i]._id === contact._id) {
					contacts[i].name = editName;
					contacts[i].phone = editPhone;
					contacts[i].category = group;
				}
			}
			$('#contacts form').replaceWith(li);
			disabledCheckBoxes();
			document.querySelectorAll('input[type=checkbox]').forEach(function (element) {
				element.nextElementSibling.classList.remove('checkBoxEdit');
			});

		}
	});
	save.addEventListener('click', hideCheckBoxes);

	$(`#${e.target.parentElement.id}`).replaceWith(contactDiv);
}

function disabledCheckBoxes() {
	let checkBoxes = document.querySelectorAll('input[type=checkbox]');
	checkBoxes.forEach(function (element) {
		element.checked = false;
	});
}

function isNumberKey(e) {
	let charCode = (e.which) ? e.which : event.keyCode;
	return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

function hideContactForm() {
	$('#contactsForm form')[0].classList.toggle('hide');
}

function hideCheckBoxes() {
	$('#checkBoxes')[0].classList.toggle('hide');
}
function hideCont() {
	$('.form-hide-contacts').toggle('form-visible');
}