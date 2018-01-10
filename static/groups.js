let groups = [];

jQuery(function ($) {
	$('#groupSubmit').on('click', addGroup);
	$('#hide-groups').on('click', hideGroup);
	getGroups();
});

function getGroups() {
	$.get('/api/v1/groups', function (data) {
		groups = data.groups;
		renderGroup();
		addGroupCheckBoxes($('#checkBoxes'));
	})
}

function addGroupCheckBoxes(form) {
	groups.forEach(function (element) {
		let div = document.createElement('div');
		div.setAttribute('data-groupId', element._id);
		let checkBox = document.createElement('input');
		checkBox.setAttribute('type', 'checkbox');
		checkBox.value = element.title;
		let label = document.createElement('label');
		label.appendChild(document.createTextNode(element.title));
		div.append(checkBox);
		div.append(label);
		form.append(div);
	})
}

function renderGroup() {
	$('#allContacts')[0].addEventListener('click', filter);
	groups.forEach(function (element) {
		let li = document.createElement('li');
		li.innerText = element.title;
		li.setAttribute('data-group', `${element.title}`);
		li.setAttribute('id', `${element._id}`);

		let del = document.createElement('span');
		del.addEventListener('click', removeGroup);
		del.setAttribute('class', 'btn btn-danger btn-xs glyphicon glyphicon-trash');

		let edit = document.createElement('span');
		edit.addEventListener('click', editGroup);
		edit.setAttribute('class', 'btn btn-warning btn-xs glyphicon glyphicon-pencil');

		li.append(edit);
		li.append(del);

		li.addEventListener('click', filter);
		$('#groups').append(li);
	})
}

function filter(e) {
	let resContacts = [];
	contacts.forEach(function (element) {
		if (element.category.includes(e.target.dataset.group.toString())) {
			resContacts.push(element);
		}
	});

	allGroups = document.getElementById('groups').querySelectorAll('li');
	for (let i= 0; i < allGroups.length; i++) {
		if (e.target.id === allGroups[i].id) {
			allGroups[i].classList.add('test');
		} else {
			allGroups[i].classList.remove('test');
		}
	}

	hideContacts();
	renderContact(resContacts);
}

function hideContacts() {
	let ul = document.getElementById('contacts');

	ul.querySelectorAll('li').forEach(function (element) {
		element.remove();
	})
}

function addGroup() {
	if ($('#title').val() !== '') {
		$.ajax({
			url: '/api/v1/groups',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				"title": $('#title').val()
			}),
			dataType: 'json',
		})
	}
}

function removeGroup(e) {
	$.ajax({
		url: `/api/v1/group/${e.target.parentElement.id}`,
		type: 'DELETE',
		dataType: 'json'
	});

	$(`#${e.target.parentElement.id}`).remove();
	e.stopPropagation();
	document.querySelector(`[data-groupId="${e.target.parentElement.id}"]`).remove();
}

function editGroup(e) {
	let groupText = e.target.parentElement.innerText;

	let groupDiv = document.createElement('form');
	let title = document.createElement('input');
	let save = document.createElement('button');
	save.setAttribute('class', 'btn btn-primary');
	save.innerText = 'Save';
	title.setAttribute('type', 'text');
	title.setAttribute('class', 'form-control');
	title.setAttribute('id', 'editTitle');
	title.value = groupText;

	groupDiv.append(title);
	groupDiv.append(save);


	$(`#${e.target.parentElement.id}`).replaceWith(groupDiv);

	let text = $('#editTitle').val();
	e.stopPropagation();


	save.addEventListener('click', function () {
		if ($('#editTitle').val() !== '') {
			$.ajax({
				url: `/api/v1/group/${e.target.parentElement.id}`,
				type: 'PUT',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify({
					title: $('#editTitle').val()
				})
			});

			let contactId = 0;
			for (let i = 0; i < contacts.length; i++) {
				for (let j = 0; j < contacts[i].category.length; j++) {
					if (contacts[i].category[j] === text) {
						contacts[i].category.splice(contacts[i].category.indexOf(text), 1);
						contacts[i].category.push($('#editTitle').val().toString());
						contactId = contacts[i]._id;
						$.ajax({
							url: `/api/v1/contact/${contactId}`,
							type: 'PUT',
							dataType: 'json',
							contentType: 'application/json',
							data: JSON.stringify({
								category: contacts[i].category
							})
						})
					}
				}
			}
		}
	});
}

function hideGroup() {
	$('#groupForm form')[0].classList.toggle('hide');
}

function hideGr() {
	$('.form-hide-group').toggle('form-visible');
}