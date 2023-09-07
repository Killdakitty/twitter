const React = require("react");
const DefaultLayout= require('./Layout/Default')


function New() {
  return (
    <DefaultLayout title="create new tweet">
       {/* action = where form post the data */}
      <form action="/api/tweets" method="POST">
       
        Title: <input type="text" name="title" required />
       
        Author: <input type="text" name="author" required />
       
        Body:  <textarea name="body" required></textarea>
       
        <input type="submit" value="Post" />
      
      </form>
    </DefaultLayout>
  );
}

module.exports = New;
