import { TopicPage, topicMetadata } from '@/components/topic/TopicPage'

export const generateMetadata = () => topicMetadata('administrative-document-types')

export default function Page() {
  return <TopicPage id="administrative-document-types" />
}
