'use client';

import type { FC } from 'react';

const ImprintPage: FC = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Imprint</h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Information in accordance with Section 5 TMG</h2>
          <div className="space-y-2 text-gray-900">
            <p>orbal GmbH / growthepie</p>
            <p>Möckernstr. 120</p>
            <p>10963 Berlin</p>
            <p>Germany</p>
          </div>
          
          <div className="mt-4 space-y-2 text-gray-900">
            <p>Commercial Register: HRB 252443 B (Amtsgericht Charlottenburg)</p>
            <p>VAT ID: DE361013740</p>
            <p>Managing Director: Matthias Seidl</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Contact Information</h2>
          <div className="space-y-2 text-gray-900">
            <p>Email: matthias@orbal-analytics.com</p>
            <p>Website: www.orbal-analytics.com</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Accountability for Content</h2>
          <p className="text-gray-700">
            The contents of our pages have been created with the utmost care. However, we cannot guarantee the contents&apos; accuracy, completeness or topicality. According to statutory provisions, we are furthermore responsible for our own content on these web pages. In this matter, please note that we are not obliged to monitor the transmitted or saved information of third parties, or investigate circumstances pointing to illegal activity. Our obligations to remove or block the use of information under generally applicable laws remain unaffected by this as per §§ 8 to 10 of the Telemedia Act (TMG).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Accountability for Links</h2>
          <p className="text-gray-700">
            Responsibility for the content of external links (to web pages of third parties) lies solely with the operators of the linked pages. No violations were evident to us at the time of linking. Should any legal infringement become known to us, we will remove the respective link immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Copyright</h2>
          <p className="text-gray-700">
            Our web pages and their contents are subject to German copyright law. Unless expressly permitted by law, every form of utilizing, reproducing or processing works subject to copyright protection on our web pages requires the prior consent of the respective owner of the rights. Individual reproductions of a work are only allowed for private use. The materials from these pages are copyrighted and any unauthorized use may violate copyright laws.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ImprintPage;