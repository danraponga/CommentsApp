const commentForm = document.getElementById('commentForm');
const commentsDiv = document.getElementById('comments');
const filterForm = document.getElementById('filterForm');

function displayComment(comment) {
    console.log("Displaying comment: ", comment);
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment-box');
    commentDiv.innerHTML = `
        <div class="info">
            <strong>${comment.username}</strong> (<a href="mailto:${comment.email}">${comment.email}</a>)
            <small class="text-muted">${new Date(comment.created_at).toLocaleString()}</small>
        </div>
        <div class="content">${comment.text}</div>
        ${comment.image ? `<div class="image mt-2"><img src="${comment.image}" alt="Image" class="img-fluid"></div>` : ''}
        ${comment.file ? `<div class="file mt-2"><a href="${comment.file}" download>Download File</a></div>` : ''}
        <div class="actions">
            <button onclick="openReplyModal('${comment.id}')">Reply</button>
            <div id="replies-${comment.id}" class="replies"></div>
        </div>
    `;
    if (comment.parent) {
        const parentDiv = document.getElementById('replies-' + comment.parent);
        parentDiv.prepend(commentDiv);
        // Automatically show replies for the parent comment
        showReplies(comment.parent);
        let showRepliesButton = document.querySelector(`[onclick="toggleReplies('${comment.parent}')"]`);
        if (!showRepliesButton && comment.parent) {
            const parentCommentDiv = parentDiv.closest('.comment-box');
            showRepliesButton = document.createElement('button');
            showRepliesButton.className = 'btn btn-link';
            showRepliesButton.setAttribute('onclick', `toggleReplies('${comment.parent}')`);
            showRepliesButton.textContent = 'Show Replies';
            parentCommentDiv.querySelector('.actions').appendChild(showRepliesButton);
            console.log("Added 'Show Replies' button to parent comment");
        }
    } else {
        commentsDiv.prepend(commentDiv);
    }
}

function toggleReplies(commentId) {
    const repliesDiv = document.getElementById('replies-' + commentId);
    if (repliesDiv.style.display === 'none' || !repliesDiv.style.display) {
        repliesDiv.style.display = 'block';
    } else {
        repliesDiv.style.display = 'none';
    }
}

function showReplies(commentId) {
    const repliesDiv = document.getElementById('replies-' + commentId);
    repliesDiv.style.display = 'block';
}

function openCommentModal() {
    console.log("Opening comment modal for new comment");
    document.getElementById('parent_id').value = '';  // Clear the parent_id for new top-level comments
    $('#commentModal').modal('show');
}

function openReplyModal(parentId) {
    console.log("Opening reply modal for parent ID: ", parentId);
    document.getElementById('parent_id').value = parentId;
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
