import { TopicPage, topicMetadata } from '@/components/topic/TopicPage'

export const generateMetadata = () => topicMetadata('decree-30-drafting')

export default function Page() {
  return <TopicPage id="decree-30-drafting" />
}
