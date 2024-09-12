import React from 'react'
import ImageHeader from '../components/ImageHeader'

const Policies = () => {
    return (
        <div>
            <ImageHeader />
            <div className="my-4">
                <h2 className='h2-class'>Open Access</h2>
                <p className='p-class'>The Open Access publication model facilitates the widespread distribution of research articles to a global audience via the internet, without any limitations. Consequently, any individual with internet access can freely retrieve all articles published under the Open Access framework. Scientific Journals Portal wholeheartedly endorses the Open Access initiative, ensuring that abstracts and complete texts of all their published articles are readily available to the public immediately upon release.</p>

                <div className="">
                    <h2 className='h2-class'>Creative Commons</h2>
                    <p className='p-class'>The Scientific Journals Portals’ published articles are subject to the Creative Commons Attribution 4.0 International License, which allows for the copying, redistribution, remixing, transmission, and adaptation of the work, provided that the original work and source are cited appropriately
                    </p>
                </div>
                <div className="">
                    <h2 className='h2-class'>CrossRef Policy</h2>
                    <p className='p-class'><a href='http://www.crossref.org/'>Crossref</a>  is an organisation comprising publishers that has devised the Digital Object Identification (DOI) system for the distinctive identification of published materials. Scientific Journals Portal, as a member of Crossref, employs the DOI system to assign unique identifiers to all its published articles.
                    </p>
                </div>
                <div className="">
                    <h2 className='h2-class'>SimilarityCheck</h2>
                    <p className='p-class'>The initiative known as <a href='http://www.crossref.org/crosscheck/index.html'>SimilarityCheck</a>, which is supported by Crossref, aims to facilitate the active participation of its members in combating scholarly and professional plagiarism. Scientific Journals Portal proudly stands as a member of SimilarityCheck.
                    </p>
                </div>
                <div className="">
                    <h2 className='h2-class'>Digital Archiving</h2>
                    <p className='p-class'>The Scientific Journals Portal is dedicated to ensuring the enduring preservation of its content. All articles that are published by the journal are safeguarded by <a href='https://www.portico.org/publishers/ajournals/'>Portico</a> . Furthermore, the journal encourages authors to store the published version of their articles in their institutional repositories and on our other suitable websites.
                    </p>
                </div>
                <div className="">
                    <h2 className='h2-class'>Self-Archiving</h2>
                    <p className='p-class'>The Scientific Journals Portal is classified as a RoMEO green publisher, which grants authors the freedom to store and preserve their articles in various formats. This includes the option to archive the published version of their article on this institutional repository or any other appropriate platform.

                    </p>
                </div>
                <div className="">
                    <h2 className='h2-class'>Article Copyright</h2>
                    <p className='p-class'>When an article is published on the Scientific Journals Portal, the copyright ownership of the published article is retained by the authors and not by the portal. This means that authors have the right to republish their articles as part of a book or other materials. However, in order for authors to maintain copyright ownership of a published article, they must adhere to the following conditions:
                        <p>• Properly cite the original source of the publication when reusing the article.</p>
                        <p>• Acknowledge that the article will remain published on the Scientific Journals Portal website, except in the event of a retraction of the article.</p>
                        <p>• The article is licensed under the <a href='http://creativecommons.org/licenses/by/4.0/'>Creative Commons Attribution 4.0 International License</a>.</p>
                        <p>• The article is published open access.</p>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Policies