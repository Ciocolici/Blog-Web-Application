import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

let posts = [
  { id: 1, title: "The Day My Cat Became a Ninja", content: "Have you ever wondered what your cat does when you’re not home? Well, I found out the hard way. One day, I came home to find my living room turned into a scene straight out of a ninja movie.\n\nThere were shredded curtains, overturned furniture, and my cat, Mr. Whiskers, sitting proudly in the middle of it all, wearing a tiny black mask. I swear he even had a little sword strapped to his back.\n\nI decided to set up a camera to catch him in action. The footage revealed Mr. Whiskers performing acrobatic flips, scaling walls, and practicing his stealth moves. He even managed to sneak up on the dog and give him a good scare.\n\nSo, if you ever hear strange noises at night, don’t worry. It’s probably just your cat practicing to become the next feline ninja master." },
  { id: 2, title: "The Great Cookie Heist", content: "It was a quiet evening, and I was in the kitchen baking a fresh batch of chocolate chip cookies. The aroma filled the house, and I could see my family eagerly waiting for the first batch to come out of the oven.\n\nAs soon as the cookies were done, I placed them on the cooling rack and went to grab some milk. When I returned, the cookies were gone! All that was left was a trail of crumbs leading to the living room.\nI followed the trail and found my dog, Max, sitting on the couch with a guilty look on his face and cookie crumbs all over his snout. He had managed to pull off the greatest cookie heist in history.\nWe all had a good laugh, and Max got a stern talking-to (and a belly rub). From that day on, we made sure to keep a close eye on our baked goods, because you never know when the Cookie Bandit might strike again." },
];

app.get("/", (req, res) => {
  const lastPost = posts.length > 0 ? posts[posts.length - 1] : null; // if there are posts, get the last one, otherwise, return null
  res.render("index.ejs", { currentRoute: '/', title: "The Tiny Blogs", lastPost });
});

app.get("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);
  if (post) {
    res.render("viewPost.ejs", {
      title: post.title,
      post,
      content: post.content,
      currentRoute: req.path
    });
  } else {
    res.status(404).render("404.ejs", { title: "404: Page Not Found", post, currentRoute: req.path });
  }
});

app.get("/createPost", (req, res) => {
  res.render("createPost.ejs", { currentRoute: '/createPost', title: "New Tiny Blogs Post" });
});

app.post("/submit", (req, res) => {
  const { title, content } = req.body;
  const id = posts.length + 1;
  const newPost = { id, title, content };
  posts.push(newPost);
  res.redirect(`/posts/${id}`);
});

app.get("/editPost/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);
  if (post) {
    res.render("editPost.ejs", {
      title: post.title,
      post,
      content: post.content,
      currentRoute: req.path
    });
  } else {
    res.status(404).render("404.ejs", { title: "404: Page Not Found", post, currentRoute: req.path });
  }
});

app.put("/editPost/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId); // like a foor loop, but it stops when it finds the post equal to postID

  if (post) {
    const { title, content } = req.body;
    post.title = title;
    post.content = content;
    res.redirect(`/posts/${req.params.id}`);
  } else {
    res.status(404).render("404.ejs", { title: "404: Page Not Found", post, currentRoute: req.path });
  }
});

app.delete("/deletePost/:id", (req, res) => {
  const postId = parseInt(req.params.id); // Convert to int
  const postIndex = posts.findIndex((post) => post.id === postId); // looks for the index of the post with the id

  if (postIndex !== -1) {
    // if the post exists
    posts.splice(postIndex, 1); // remove the post from the array
    res.redirect("/posts"); // redirect to the posts page
  } else {
    res.status(404).render("404.ejs", { title: "404: Page Not Found", post, currentRoute: req.path }); // if the post does not exist, send a 404 status
  }
});

app.get("/posts", (req, res) => {
  res.render("listPosts.ejs", { currentRoute: '/posts', title: "Your Tiny Blogs Posts", posts });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
