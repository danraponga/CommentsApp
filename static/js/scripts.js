const commentForm = document.getElementById('commentForm');
const commentsDiv = document.getElementById('comments');
const filterForm = document.getElementById('filterForm');

function displayErrors(errors) {
    const previousErrorDiv = document.querySelector('.alert-danger');
    if (previousErrorDiv) {
        previousErrorDiv.remove();
    }

    let errorMessages = '';
    for (const field in errors) {
        if (errors.hasOwnProperty(field)) {
            const messagesArray = errors[field];
            messagesArray.forEach(messageObj => {
                errorMessages += `<p>${field}: ${messageObj.message}</p>`;
            });
        }
    }

    const errorDiv = document.createElement('div');
    errorDiv.classList.add('alert', 'alert-danger');
    errorDiv.innerHTML = errorMessages;
    document.querySelector('.modal-body').prepend(errorDiv);
}

function displayComment(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment-box');
    commentDiv.innerHTML = `
        <div class="info">
            <strong>${comment.username}</strong> (<a href="mailto:${comment.email}">${comment.email}</a>)
            <small class="text-muted">${new Date(comment.created_at).toLocaleString()}</small>
        </div>
        <div class="content">${comment.text}</div>
        ${comment.image ? `<div class="image mt-2"><a href="${comment.image}" data-lightbox="comment-${comment.id}"><img src="${comment.image}" alt="Image" class="img-fluid"></a></div>` : ''}
        ${comment.file ? `<div class="file mt-2"><a href="${comment.file}" download>Download File</a></div>` : ''}
        <div class="actions">
            <button class="btn btn-primary" onclick="openCommentModal('${comment.id}')">Reply</button>
            <button class="btn btn-secondary" onclick="toggleReplies(this, '${comment.id}')">Show Replies</button>
            <div id="replies-${comment.id}" class="replies"></div>
        </div>
    `;
    if (comment.parent) {
        const parentDiv = document.getElementById('replies-' + comment.parent);
        if (parentDiv) {
            parentDiv.prepend(commentDiv);
            showReplies(comment.parent);
            let showRepliesButton = document.querySelector(`[onclick="toggleReplies('${comment.parent}')"]`);
            if (!showRepliesButton && comment.parent) {
                const parentCommentDiv = parentDiv.closest('.comment-box');
                showRepliesButton = document.createElement('button');
                showRepliesButton.className = 'btn btn-link';
                showRepliesButton.setAttribute('onclick', `toggleReplies('${comment.parent}')`);
                showRepliesButton.textContent = 'Show Replies';
                parentCommentDiv.querySelector('.actions').appendChild(showRepliesButton);
            }
        } else {
            commentsDiv.prepend(commentDiv);
        }
    } else {
        commentsDiv.prepend(commentDiv);
    }
}

function toggleReplies(button, commentId) {
    const repliesDiv = document.getElementById('replies-' + commentId);
    if (repliesDiv.style.display === 'none' || !repliesDiv.style.display) {
        repliesDiv.style.display = 'block';
        button.textContent = 'Hide Replies';
    } else {
        repliesDiv.style.display = 'none';
        button.textContent = 'Show Replies';
    }
}

function showReplies(commentId) {
    const repliesDiv = document.getElementById('replies-' + commentId);
    repliesDiv.style.display = 'block';
}

function openCommentModal(parentId = '') {
    document.getElementById('parent_id').value = parentId;
    const errorDiv = document.querySelector('.alert-danger');
    if (errorDiv) {
        errorDiv.remove();
    }
    $('#commentModal').modal('show');
}

function applyFilters() {
    const username = document.getElementById('filterUsername').value;
    const email = document.getElementById('filterEmail').value;
    const sortOrder = document.getElementById('sortOrder').value;
    let query = '?';

    if (username) {
        query += `username=${username}&`;
    }
    if (email) {
        query += `email=${email}&`;
    }
    query += `date_order=${sortOrder}`;

    window.location.href = query;
}

function closeCommentModal() {
    $('#commentModal').modal('hide');
}
