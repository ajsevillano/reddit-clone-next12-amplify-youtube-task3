//React
import { useEffect, useState } from 'react';
//Material UI styles
import { Container, Typography } from '@mui/material';
//Context
import { useUser } from '../context/AuthContext';
//API & GrahpQL
import { API } from 'aws-amplify';
import { listPosts } from '../graphql/queries';
import { ListPostsQuery, Post } from '../API';
import PostPreview from '../components/PostPreview';

export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPostsFromApi = async (): Promise<Post[]> => {
      const allPosts = (await API.graphql({ query: listPosts })) as {
        data: ListPostsQuery;
        errors: any[];
      };

      if (allPosts.data) {
        setPosts(allPosts.data.listPosts!.items as Post[]);
        return allPosts.data.listPosts!.items as Post[];
      } else {
        throw new Error('Could not get posts');
      }
    };

    fetchPostsFromApi();
  }, []);

  return (
    <Container maxWidth="md">
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </Container>
  );
}
