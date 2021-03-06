import { PropTypes }       from 'react';
import { propType }        from 'graphql-anywhere';
import { graphql }         from 'react-apollo';
import gql                 from 'graphql-tag';

import VoteButton          from './vote_button.component';

import upVoteMutation      from './up_vote.mutation.graphql';

import commentFragment     from './comment.fragment.graphql';
import commentDataFragment from './comment_data.fragment.graphql';
import upVoteFragment      from './up_vote.fragment.graphql';
import downVoteFragment    from './down_vote.fragment.graphql';

export const UpVoteButton = ({ comment: { upVotes, upVoted, downVoted }, upVote }) => {
  let selectedClass = '';

  if (upVoted) {
    selectedClass = 'is-vote-selected';
  } else if (downVoted) {
     selectedClass = 'is-vote-notselected';
  }

  return (
    <VoteButton
      buttonClassName="comment__votes--up"
      iconName="icon-chevron-top"
      votes={upVotes}
      voteAction={upVote}
      disabled={upVoted || downVoted}
      selectedClass={selectedClass}
    />
  );
}

UpVoteButton.fragments = {
  comment: gql`
    ${upVoteFragment}
  `
};

UpVoteButton.propTypes = {
  comment: propType(UpVoteButton.fragments.comment).isRequired,
  upVote: PropTypes.func.isRequired
};

const UpVoteButtonWithMutation = graphql(gql`
  ${upVoteMutation}
  ${commentFragment}
  ${commentDataFragment}
  ${upVoteFragment}
  ${downVoteFragment}
`, {
  props: ({ ownProps, mutate }) => ({
    upVote: () => mutate({
      variables: {
        id: ownProps.comment.id
      },
      optimisticResponse: {
        __typename: 'Mutation',
        comment: {
          __typename: 'CommentMutation',
          upVote: {
            __typename: 'Comment',
            ...ownProps.comment,
            upVotes: ownProps.comment.upVotes + 1,
            upVoted: true
          }
        }
      },
      updateQueries: {
        GetComments: (prev, { mutationResult: { data } }) => {
          const commentReducer = (comment) => {
            const replies = comment.comments || [];

            if (comment.id === ownProps.comment.id) {
              return data.comment.upVote;
            }
            return {
              ...comment,
              comments: replies.map(commentReducer)
            };
          };

          return {
            ...prev,
            commentable: {
              ...prev.commentable,
              comments: prev.commentable.comments.map(commentReducer)
            }
          }
        }
      }
    })
  })
})(UpVoteButton);

export default UpVoteButtonWithMutation;
