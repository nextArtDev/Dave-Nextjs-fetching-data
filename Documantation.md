We __can__ create a *lib* folder to place all fetching functions inside it to organize our code and possible reusability.
it should be in the **root** of our project

---
We can import types by *type* keyword 
```typescript
import type { Metadata } from "next";
```
---
we can create a _type_ definition like whats in root directory of next app: _next-env.d.ts_ for a type and we don't **need to import it!**
because _tsconfig.json_ **includes** it. 
we can name it: **types.d.ts** inside _root_ dir.

## Fetching Data
1. Fetch data on the server using Server Components.
2. Fetch data in parallel to minimize waterfalls and reduce loading times.
...It means do not *await* data for each request:

```typescript
const UserPage = async ({ params: { userId } }: UserPageProps) => {
  const userData: Promise<User> = getUser(userId)
  const userPostsData: Promise<Post[]> = getUserPosts(userId)
```

instead we're waiting to resolve them in **parallel** to not create waterfalls for awaiting for each request separately.
we request them at the same time.

```typescript
 const [user, userPosts] = await Promise.all([userData, userPostsData])
```

or we can **await** for one and **Suspense** another one!

```typescript
const userData: Promise<User> = getUser(userId)
  const userPostsData: Promise<Post[]> = getUserPosts(userId)
const user = await userData //One await
  return (
    <>
      <h2>{user.name}</h2>
      <br />
      <Suspense fallback={<h2>Loading</h2>}>
         <UserPosts promise={userPosts} />  //One promise 
      </Suspense>
    </>
  )
}
```

and then we get it in **UserPosts** component:
```typescript
interface UserPostsProps {
  promise: Promise<Post[]>
}

const UserPosts = async ({ promise }: UserPostsProps) => {
  const posts = await promise

  const content = posts.map((post) => {
    const { id, title, body } = post
    return (
      <article key={id}>
        <h2>{title}</h2>
        <p>{body}</p>
        <br />
      </article>
    )
  })
  return content
}
```

that **Suspense** cause to incrementally show the data we get.

---
when we request data in **generateMetadata** request will deduplicate and does not repeat again