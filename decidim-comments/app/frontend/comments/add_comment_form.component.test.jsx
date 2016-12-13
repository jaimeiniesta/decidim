/* eslint-disable no-unused-expressions */
import { shallow, mount }      from 'enzyme';

import { AddCommentForm }      from './add_comment_form.component';

import generateCurrentUserData from '../support/generate_current_user_data';

describe("<AddCommentForm />", () => {
  let currentUser = null;
  const commentableId = "1";
  const commentableType = "Decidim::ParticipatoryProcess";
  const addCommentStub = () => {
    return null;
  }

  beforeEach(() => {
    currentUser = generateCurrentUserData();
  });

  it("should render a div with class add-comment", () => {
    const wrapper = shallow(<AddCommentForm addComment={addCommentStub} currentUser={currentUser} commentableId={commentableId} commentableType={commentableType} />);
    expect(wrapper.find('div.add-comment')).to.present();
  });

  it("should have a reference to body textarea", () => {
    const wrapper = mount(<AddCommentForm addComment={addCommentStub} currentUser={currentUser} commentableId={commentableId} commentableType={commentableType} />);
    expect(wrapper.instance().bodyTextArea).to.be.ok;
  });

  it("should initialize with a state property disabled as true", () => {
    const wrapper = mount(<AddCommentForm addComment={addCommentStub} currentUser={currentUser} commentableId={commentableId} commentableType={commentableType} />);
    expect(wrapper).to.have.state('disabled', true);
  });

  it("should enable the submit button if textarea is not blank", () => {
    const wrapper = mount(<AddCommentForm addComment={addCommentStub} currentUser={currentUser} commentableId={commentableId} commentableType={commentableType} />);
    wrapper.find('textarea').simulate('change', {
      target: {
        value: 'This is a comment'
      }
    });
    expect(wrapper.find('input[type="submit"]')).not.to.be.disabled();
  });

  it("should disable the submit button if textarea is blank", () => {
    const wrapper = mount(<AddCommentForm addComment={addCommentStub} currentUser={currentUser} commentableId={commentableId} commentableType={commentableType} />);
    wrapper.find('textarea').simulate('change', {
      target: {
        value: 'This will be deleted'
      }
    });
    wrapper.find('textarea').simulate('change', {
      target: {
        value: ''
      }
    });
    expect(wrapper.find('input[type="submit"]')).to.be.disabled();
  });

  describe("submitting the form", () => {
    let onAddComment = null;
    let wrapper = null;
    let message = null;

    beforeEach(() => {
      onAddComment = sinon.spy();
      wrapper = mount(<AddCommentForm addComment={onAddComment} currentUser={currentUser} commentableId={commentableId} commentableType={commentableType} />);
      message = 'This will be submitted';
      wrapper.instance().bodyTextArea.value = message;
    });

    it("should call addComment prop with the textarea value", () => {
      wrapper.find('form').simulate('submit');
      expect(onAddComment).to.calledWith({ body: message });
    })

    it("should reset textarea", () => {
      wrapper.find('form').simulate('submit');
      expect(wrapper.find('textarea')).to.have.value('');
    });

    it("should prevent default form submission", () => {
      const preventDefault = sinon.spy();
      wrapper.find('form').simulate('submit', { preventDefault });
      expect(preventDefault).to.have.been.called;
    });
  });
});