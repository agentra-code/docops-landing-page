import { TopicPage, topicMetadata } from '@/components/topic/TopicPage'

export const generateMetadata = () => topicMetadata('administrative-document-format')

export default function Page() {
  return <TopicPage id="administrative-document-format" />
}
