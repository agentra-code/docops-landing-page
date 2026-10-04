import { TopicPage, topicMetadata } from '@/components/topic/TopicPage'

export const generateMetadata = () => topicMetadata('legal-basis-review')

export default function Page() {
  return <TopicPage id="legal-basis-review" />
}
