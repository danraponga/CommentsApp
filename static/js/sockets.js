const ws = new WebSocket('ws://' + window.location.host + '/ws/comments/');

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.errors) {
        displayErrors(data.errors);
    } else if (data.comment) {
        displayComment(data.comment);
        document.getElementById('commentForm').reset();
        console.log("Recieved")
        closeCommentModal();
    }
};

commentForm.onsubmit = function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const homepage = document.getElementById('homepage').value;
    const text = document.getElementById('text').value;
    const parent_id = document.getElementById('parent_id').value;
    const imageInput = document.getElementById('image');
    const fileInput = document.getElementById('file');

    const message = {
        username: username,
        email: email,
        homepage: homepage,
        text: text,
        parent_id: parseInt(parent_id) || null
    };

    if (imageInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(event) {
            message.image = event.target.result;
            if (fileInput.files.length > 0) {
                const fileReader = new FileReader();
                fileReader.onload = function(event) {
                    message.file = event.target.result;
                    sendWebSocketMessage(message);
                };
                fileReader.readAsDataURL(fileInput.files[0]);
            } else {
                sendWebSocketMessage(message);
            }
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else if (fileInput.files.length > 0) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            message.file = event.target.result;
            sendWebSocketMessage(message);
        };
        fileReader.readAsDataURL(fileInput.files[0]);
    } else {
        sendWebSocketMessage(message);
    }
};

function sendWebSocketMessage(message) {
    ws.send(JSON.stringify(message));
}
