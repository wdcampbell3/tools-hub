const blogInfo = {
  name: "Freshbase Blog",
  description: "Tips and guides for aspiring app builders and vibe coders"
};
const blogPosts = [
  {
    title: "From Idea to Launch: The Vibe Coder's Guide to Shipping Your First App",
    description: "Stop overthinking. Start shipping. A practical 5-step guide for aspiring app builders who want to turn their ideas into reality.",
    link: "/blog/from_idea_to_launch_vibe_coding_guide",
    date: "2024-12-16"
  }
];
for (const post of blogPosts) {
  if (!post.parsedDate) {
    const dateParts = post.date.split("-");
    post.parsedDate = new Date(
      parseInt(dateParts[0]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[2])
    );
  }
}
const sortedBlogPosts = blogPosts.sort(
  (a, b) => (b.parsedDate?.getTime() ?? 0) - (a.parsedDate?.getTime() ?? 0)
);
export {
  blogInfo as b,
  sortedBlogPosts as s
};
