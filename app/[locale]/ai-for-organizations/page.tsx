import { TopicPage, topicMetadata } from '@/components/topic/TopicPage'

export const generateMetadata = () => topicMetadata('ai-for-organizations')

export default function Page() {
  return <TopicPage id="ai-for-organizations" />
}
