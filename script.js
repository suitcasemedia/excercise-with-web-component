const COMMENTS_URL = 'https://my-json-server.typicode.com/telegraph/frontend-exercise/comments'
const commentsIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/></svg>`
class CommentsComponent extends HTMLElement {
    constructor() {
        super();
   
    }
    static get observedAttributes() {
        return ["loading", "comments", "filterByLikes"];
    }
    fetchComments(url) {
        {
            this.loading = true;
            this.render()
            fetch(url)
                .then((response) => {
                    if (!response.ok) {
                        this.loading = false
                        this.error = response.status
                        this.render(response)
                    }
                    return response.json();
                })
                .then((response) => {
                    this.loading = false
                    this.comments = [...response];
                    this.render(response)
                });
        }
    }
    // connect component
    async connectedCallback() {
        await this.fetchComments(COMMENTS_URL);
    }
    disconnectedCallback() {}
    attributeChangedCallback(attrName, oldVal, newVal) {
        this.render(this.comments);
    }
    // component attributes
    static get observedAttributes() {
        return [, 'comments', 'filterByLikes', 'loading'];
    }
    addFilter = () => {
        const button = this.querySelector('button')
        if (button) {
            button.addEventListener("click", (event) => {
                this.filterByLikes = !this.filterByLikes
                this.render(this.comments)
            });
        }
    }
    render(response) {
        if (this.loading) {
            this.innerHTML = `<span>Loading...</span>`;
        }
        if (this.error) {
            this.innerHTML = `<div class="error">Sorry there is a ${response.status} error</div>`;
        }
        if (response && response.length) {
            const filteredResponse = response.slice().sort((b, a) => a.likes - b.likes)
            const nonFilteredResponse = response
            const commentsHeaderOutput = 
                `<div class="comments__head">
                    <div class="comments__count">
                         <img src='./comment-icon.svg' width="15px" alt="comment icon" /> ${response && response.length} Comments
                    </div>
                     <div class="comments__filter">
                        Sort <button class="${ this.filterByLikes && 'active'} " id="sortbylikes">Likes 
                    </div>
                </div> `;
            const commentsOutput = (this.filterByLikes ? filteredResponse : nonFilteredResponse).map(comment => {
                return `
                        <li class="comments__comment">
                            <div class="comments__username">${comment.name}</div>
                            <div class="comments__text">
                                ${comment.body}
                            </div>
                            <div class="comments__likes">
                                ${comment.likes} Likes
                            </div>
                        </li>`;
                    }).join('');
              this.innerHTML = `${commentsHeaderOutput}<ul class="comments__list"> ${commentsOutput} </ul>`;
        }    
        this.addFilter();
    }
}
customElements.define('comments-component', CommentsComponent)