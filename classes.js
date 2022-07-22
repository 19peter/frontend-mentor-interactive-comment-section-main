export default class Post {
    constructor(c, currentUser, container) {

        let { id } = c;

        let post = document.createElement("div");
        post.className = "post";
        this.id = id;


        let scoreSection = new Score_Section(c, post);

        let contentSection = new Content_Section(c, currentUser, post);

        container.appendChild(post)

        if (c.replies.length > 0) {
            let replyThreadBody = new Reply_Thread(post, c.replies, id, currentUser)
        }
    }
}

class Score_Section {
    constructor(c, parent) {

        let { score } = c;

        let scoreSection = document.createElement("div");
        scoreSection.className = "score-section";

        let scoreContainer = document.createElement("div");
        scoreContainer.className = "score-container";

        let incBtn = new Score_Btn("plus", scoreContainer, c).btn;
        let scoreNumber = new Score(score, scoreContainer);
        let decBtn = new Score_Btn("minus", scoreContainer, c).btn;

        scoreSection.appendChild(scoreContainer);

        parent.appendChild(scoreSection);

        incBtn.addEventListener("click", () => {
            score++;
            scoreNumber.score++;

            scoreNumber.number.innerHTML = scoreNumber.score;
        })

        decBtn.addEventListener("click", () => {
            score--;
            scoreNumber.score--;

            scoreNumber.number.innerHTML = scoreNumber.score;
        })
    }
}

class Score_Btn {
    constructor(sign, parent, c) {
        let btn = document.createElement("button");
        btn.className = "score-btn"

        let icon = document.createElement("img");
        icon.setAttribute("src", `./images/icon-${sign}.svg`);

        btn.appendChild(icon);

        parent.appendChild(btn);

        this.btn = btn;

    }
}

class Score {
    constructor(score, parent) {
        this.score = score;

        let scoreNumber = document.createElement("h4");
        scoreNumber.className = "score";
        scoreNumber.innerHTML = this.score;

        this.number = scoreNumber;
        parent.appendChild(scoreNumber);
    }
}

class Content_Section {
    constructor(c, currentUser, post) {
        let { id, createdAt, user, content, replies } = c;
        let { image, username } = user;

        let contentSection = document.createElement("div");
        contentSection.className = "content-section"

        let header = new Header(contentSection, image, username, createdAt, post, currentUser, replies, id);

        let content_ = new Content(contentSection, content);

        post.appendChild(contentSection);
    }
}

class Header {
    constructor(contentSection, image, username, createdAt, post, currentUser, replies, id) {

        let header = document.createElement("div");
        header.className = "header";

        let userImg = document.createElement("img");
        userImg.setAttribute("src", image.png);
        userImg.className = "user-img";

        header.appendChild(userImg);

        let name = document.createElement("h4");
        name.className = "name";
        name.innerHTML = username;

        if (currentUser.username === username) {
            let identifier = document.createElement("span");
            identifier.innerHTML = "You";
            identifier.className = "identifier";

            header.appendChild(name);
            header.appendChild(identifier)
        } else {
            header.appendChild(name);
        }

        let date = document.createElement("h6");
        date.className = "date";
        date.innerHTML = createdAt;

        header.appendChild(date);

        if (currentUser.username === username) {

            let deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = '<img src="./images/icon-delete.svg" />  Delete'
            deleteBtn.className = "delete";

            header.appendChild(deleteBtn);

            deleteBtn.addEventListener("click", () => {

                document.querySelector(".container").style.opacity = "0.3"
                let alert = document.createElement("div");
                alert.className = "alert";

                let body = document.createElement("div");
                body.className = "alert-body"
                let h = document.createElement("h6");
                h.innerHTML = "Delete Comment"
                let p = document.createElement("p");
                p.innerHTML = "Are you sure you want to delete this comment ?. This will remove the comment and can't be undone"
                let no = document.createElement("button");
                no.innerHTML = "NO, CANCEL"
                no.className = "no-btn"
                let yes = document.createElement("button");
                yes.innerHTML = "YES, DELETE"
                yes.className = "yes-btn"

                yes.addEventListener("click", () => {
                    alert.remove();
                    post.remove();
                    document.querySelector(".container").style.opacity = "1"

                })

                no.addEventListener("click", () => {
                    alert.remove();
                    document.querySelector(".container").style.opacity = "1"

                })

                body.appendChild(h)
                body.appendChild(p)
                body.appendChild(no)
                body.appendChild(yes)

                alert.appendChild(body);

                document.body.appendChild(alert);

            })

            let editBtn = document.createElement("button");
            editBtn.innerHTML = '<img src="./images/icon-edit.svg" />  Edit'
            editBtn.className = "edit";

            editBtn.addEventListener("click", () => {

                let text = post.querySelector(".content").innerHTML;
                post.querySelector(".content").remove();
                let textarea = document.createElement("textarea");
                textarea.className = "textarea-edit"
                textarea.innerHTML = text;
                textarea.value = text;

                let updateBtn = document.createElement("div");
                updateBtn.innerHTML = "Update"
                updateBtn.className = "update-btn";

                updateBtn.addEventListener("click", () => {
                    let newText = textarea.value;
                    let content = document.createElement("div");
                    content.className = "content"
                    content.innerHTML = newText;
                    post.querySelector(".content-section").appendChild(content);
                    updateBtn.remove();
                    textarea.remove();

                })


                post.querySelector(".content-section").appendChild(textarea);
                post.querySelector(".content-section").appendChild(updateBtn);

            })


            header.appendChild(editBtn)

        } else {
            let ReplyBtnBox = new Reply_Btn_Box(currentUser, username, header, post, replies, id);
        }


        contentSection.appendChild(header);

    }
}

class Reply_Btn_Box {
    constructor(currentUser, username, header, post, replies, id) {

        let container = document.createElement("div");
        container.className = "reply-box";

        let replyIcon = document.createElement("img");
        replyIcon.className = "reply-box-icon";
        replyIcon.setAttribute("src", './images/icon-reply.svg');

        let reply = document.createElement("button");
        reply.className = "reply-box-btn";
        reply.innerHTML = "Reply";

        container.appendChild(replyIcon);
        container.appendChild(reply);

        header.appendChild(container);


        //// Reply Box
        let s = false;

        reply.addEventListener("click", () => {


            if (!s) {

                let randId = id + 10;
                let replyBoxClass = new Reply_Box(currentUser, username, post, replies, id, randId);
                let replyBox = replyBoxClass.replyBox;

                if (id > 1) {
                    let parent = document.getElementById(id);
                    replyBox.style.width = parent.offsetWidth + "px"
                    replyBox.style.marginLeft = window.getComputedStyle(parent).marginLeft
                }

                if (replies) {

                    if (replies.length > 0) {
                        let replyThreadBody = document.getElementById(id)

                        replyThreadBody.insertAdjacentElement("afterend", replyBox);
                    } else {
                        post.insertAdjacentElement("afterend", replyBox);
                    }
                } else {
                    post.insertAdjacentElement("afterend", replyBox);

                }

                s = true;

            } else {
                let el = document.getElementById(id + 10);

                if (el.style.display == "flex") {
                    el.style.display = "none"
                } else {
                    let el = document.getElementById(id + 10);

                    el.style.display = "flex"
                }
            }



            s = true;


        })
    }
}

class Content {
    constructor(contentSection, contentData) {
        let content = document.createElement("div");
        content.className = "content";

        content.innerHTML = contentData;

        contentSection.appendChild(content);
    }
}

class Reply_Box {
    constructor(currentUser, postAuthor, post, replies, id, randId) {
        let { image, username } = currentUser;

        let replyBox = document.createElement("div");
        replyBox.className = "reply-box-main";
        replyBox.id = randId;

        let userImage = document.createElement("img");
        userImage.setAttribute("src", image.png);

        let textarea = document.createElement("textarea");
        textarea.classList.add("textarea")
        textarea.innerHTML = `@${postAuthor} `

        let replying = document.createElement("button");
        replying.classList.add("replying");
        replying.innerHTML = "Reply";

        replyBox.appendChild(userImage);
        replyBox.appendChild(textarea);
        replyBox.appendChild(replying);


        this.replyBox = replyBox;


        replying.addEventListener("click", () => {

            if (textarea.value.length > postAuthor.length + 3) {
                let reply = {
                    "id": Math.floor(Math.random() * 100 + 1),
                    "content": textarea.value,
                    "createdAt": "Now",
                    "score": 0,
                    "replyingTo": postAuthor,
                    "user": {
                        "image": {
                            "png": `./images/avatars/image-${username}.png`,
                            "webp": `./images/avatars/image-${username}.webp`
                        },
                        "username": username
                    }
                }

                if (replies) {
                    if (replies.length == 0) {
                        let newReply = new Reply_Thread(post, [reply], post.id, currentUser)
                    } else {
                        let replyParent = document.getElementById(id);
                        let newReply = new Reply(reply, replyParent, currentUser);
                    }
                } else if (typeof replies === "undefined") {
                    let replyParent = document.getElementById(id);
                    let newReply = new Reply(reply, null, currentUser);
                    replyParent.insertAdjacentElement("afterend", newReply.reply);


                }

                replyBox.style.display = "none";
                textarea.innerHTML = `@${postAuthor} `
                textarea.value = `@${postAuthor} `;
            }



        })


    }
}

class Reply_Thread {
    constructor(post, replies, id, currentUser) {
        let replyThreadBody = document.createElement("div");
        replyThreadBody.className = "reply-thread-body";
        replyThreadBody.id = id;

        replies.forEach(r => {
            let reply = new Reply(r, replyThreadBody, currentUser, id);
        });

        post.insertAdjacentElement("afterend", replyThreadBody);

    }
}



class Reply {
    constructor(r, replyThreadBody, currentUser) {
        let reply = document.createElement("div");
        reply.className = "reply-container"
        reply.id = r.id;

        let scoreSection = new Score_Section(r, reply);

        let contentSection = new Content_Section(r, currentUser, reply)

        if (replyThreadBody == null) {
            this.reply = reply
        } else {
            replyThreadBody.appendChild(reply);
        }

    }
}



