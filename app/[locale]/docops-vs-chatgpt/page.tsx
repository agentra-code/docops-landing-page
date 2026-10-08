import { TopicPage, topicMetadata } from '@/components/topic/TopicPage'

export const generateMetadata = () => topicMetadata('docops-vs-chatgpt')

export default function Page() {
  return <TopicPage id="docops-vs-chatgpt" />
}
