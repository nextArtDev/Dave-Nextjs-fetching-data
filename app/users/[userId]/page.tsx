import getUser from '@/lib/getUser'
import { Suspense } from 'react'
import UserPosts from './components/UserPosts'
import { Metadata } from 'next'
import getUserPosts from '@/lib/getUserPosts'
import getAllUsers from '@/lib/getAllUsers'
import { notFound } from 'next/navigation'
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

  if (!user.name) {
    return {
      title: 'User Not Found',
    }
  }

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

  if (!user.name) return notFound()

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

export async function generateStaticParams() {
  const usersData: Promise<User[]> = getAllUsers()
  const users = await usersData

  return users.map((user) => ({
    userId: user.id.toString(),
  }))
}

export default UserPage
