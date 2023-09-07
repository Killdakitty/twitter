const React= require('react');
const DefaultLayout= require('./Layout/Default')

function Index({tweets}){
    return(
        <DefaultLayout>
<nav>
    <a href='/tweets/new'>Create a New Tweet</a>
</nav>

<ul>
    {tweets.map(tweet=>{
        return(
            <li key={tweet._id} className='border p-5'>
                <a href={`/tweets/${tweet._id}`}>{tweet.title}</a>
                <p>{tweet.body}</p>
                <p>{tweet.author}</p>

                <div>
                    <a href={`/api/tweets/add-like/${tweet._id}`}>Like</a>
                </div>
                <span>Likes: {tweet.likes}</span>
                <span> {tweet.sponsored ? 'sponsered': ''}</span>


                <br/>   

                <a href={`/tweets/${tweet._id}/edit`}>Edit Tweet</a>
                <form method="POST" action={`/api/tweets/${tweet._id}?_method=DELETE`}>
                    <input type='submit' value="Delete"/>
                </form>
            </li>
        )
    })}

</ul>


        </DefaultLayout>
    )
}

module.exports= Index