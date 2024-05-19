const commentForm = document.getElementById('commentForm');
const commentsDiv = document.getElementById('comments');
const filterForm = document.getElementById('filterForm');
const commentTemplate = Handlebars.compile(document.getElementById('comment-template').innerHTML);
const replyTemplate = Handlebars.compile(document.getElementById('reply-template').innerHTML);

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
                errorMessages += `<p>${messageObj.message}</p>`;
            });
        }
    }
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('alert', 'alert-danger');
    errorDiv.innerHTML = errorMessages;
    document.querySelector('.modal-body').prepend(errorDiv);
}

function createCommentElement(comment, isReply = false) {
    let template = isReply ? replyTemplate : commentTemplate;
    let newComment = template({
        id: comment.id,
        username: comment.username,
        email: comment.email,
        created_at: new Date(comment.created_at).toLocaleString(),
        text: comment.text,
        image: comment.image || null,
        file: comment.file || null
    });
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newComment;
    return tempDiv.firstElementChild;
}

function displayComment(comment) {
    const commentElement = createCommentElement(comment, Boolean(comment.parent));
    if (comment.parent) {
        const parentRepliesDiv = document.getElementById('replies-' + comment.parent);
        if (parentRepliesDiv) {
            parentRepliesDiv.appendChild(commentElement);  
            const parentCommentDiv = document.getElementById('comment-' + comment.parent);
            let showRepliesButton = parentCommentDiv.querySelector('.toggle-replies-btn');
            if (showRepliesButton && showRepliesButton.style.display === 'none') {
                showRepliesButton.style.display = 'inline-block';
                showRepliesButton.textContent = 'Hide Replies';
            }
            showReplies(comment.parent);
        } else {
            commentsDiv.prepend(commentElement); 
        }
    } else {
        commentsDiv.prepend(commentElement); 
    }
}

function toggleReplies(link, commentID) {
    const repliesDiv = document.getElementById('replies-' + commentID);
    if (repliesDiv.style.display === 'none' || !repliesDiv.style.display) {
        repliesDiv.style.display = 'block';
        link.innerHTML = '<i class="bi bi-chevron-double-up"> Hide Replies</i>';
    } else {
        repliesDiv.style.display = 'none';
        link.innerHTML = '<i class="bi bi-chevron-double-down"> Show Replies</i>';
    }
}

function showReplies(commentID) {
    const repliesDiv = document.getElementById('replies-' + commentID);
    if (repliesDiv.style.display === 'none' || !repliesDiv.style.display) {
        repliesDiv.style.display = 'block';
        const parentCommentDiv = document.getElementById('comment-' + commentID);
        const showRepliesButton = parentCommentDiv.querySelector('.toggle-replies-link');
        if (showRepliesButton) {
            showRepliesButton.innerHTML = '<i class="bi bi-chevron-double-up"> Hide Replies</i>';
        }
    }
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
