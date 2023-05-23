import getUserPosts from '@/lib/getUSerPosts'
import getUser from '@/lib/getUser'
import { Suspense } from 'react'
import UserPosts from './components/UserPosts'
import { Metadata } from 'next'

type UserPageProps = {
  params: {
    userId: string
  }
}

export async function generateMetadata({
  params: { userId },
}: UserPageProps): Promise<Metadata> {
  const userData: Promise<User> = getUser(userId)
  const user: User = await userData

  return {
    title: user.name,
    description: `This is the page of ${user.name}`,
  }
}

const UserPage = async ({ params: { userId } }: UserPageProps) => {
  const userData: Promise<User> = getUser(userId)
  const userPostsData: Promise<Post[]> = getUserPosts(userId)

  //   const [user, userPosts] = await Promise.all([userData, userPostsData])
  const user = await userData
  return (
    <>
      <h2>{user.name}</h2>
      <br />
      <Suspense fallback={<h2>Loading</h2>}>
        {/* @ts-expect-error Async Server Component */}
        <UserPosts promise={userPostsData} />
      </Suspense>
    </>
  )
}

export default UserPage
