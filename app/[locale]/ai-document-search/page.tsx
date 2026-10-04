import { TopicPage, topicMetadata } from '@/components/topic/TopicPage'

export const generateMetadata = () => topicMetadata('ai-document-search')

export default function Page() {
  return <TopicPage id="ai-document-search" />
}
