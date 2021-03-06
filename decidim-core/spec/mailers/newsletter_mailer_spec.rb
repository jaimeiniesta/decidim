# -*- coding: utf-8 -*-
require "spec_helper"

module Decidim
  describe NewsletterMailer, type: :mailer do
    let(:user) { create(:user, name: "Sarah Connor", organization: organization) }
    let(:newsletter) do
      create(:newsletter,
             organization: organization,
             subject: {
               en: "Email for %{name}",
               ca: "Email per %{name}",
               es: "Email para %{name}"
             },
             body: {
               en: "Content for %{name}",
               ca: "Contingut per %{name}",
               es: "Contenido para %{name}"
             })
    end

    let(:organization) { create(:organization) }

    describe "newsletter" do
      let(:mail) { described_class.newsletter(user, newsletter) }

      it "parses the subject" do
        expect(mail.subject).to eq("Email for Sarah Connor")
      end

      it "parses the body" do
        expect(email_body(mail)).to include("Content for Sarah Connor")
      end
    end
  end
end
