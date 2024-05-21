import './landpage.css';
import Image from 'next/image';

export default function LandPage() {
  return (
    <div>
      <div className="top-presentation">
        <section className="presentation">
          <h1>Welcome to a simplified Soft Tech</h1>
        </section>
        <section id="top-paragrafer">
          <p>
            We are a few people working together as a team, developing in the
            simplest way<br></br> software solution to business problems
          </p>
        </section>
      </div>
      <div className="middle-presentation">
      <article className="card">
          <div id="Isolated">
            <Image
              src="/img/top-view-person-writing-laptop-with-copy-space 1.png"
              alt="Card Image 1"
              width={500}
              height={800}
            />
            <h2 className="Title">Design Thinking</h2>
            <p className="Text">
              We understand the problem, plan the execution,<br></br> and then
              develop a prototype that fits the required solution.
            </p>
          </div>
          <div className="lado-a-lado">
            <ul>
              <li>
              <Image
                  src="/img/Man Working At Night.png"
                  alt="Card Image 2"
                  width={500}
                  height={300}
                />
                <h2 className="Title">Web Applications</h2>
                <p className="Text">
                  Let us make simple and organized the complexity of managing
                  <br></br> your business with brand new versatile web
                  applications.
                </p>
              </li>
              <li>
              <Image
                  src="/img/Girl With Smartphone.png"
                  alt="Card Image 3"
                  width={500}
                  height={300}
                />
                <h2 className="Title">Mobile Applications</h2>
                <p className="Text">
                  We can deliver the experience of a high availability<br></br>{" "}
                  in the hands of your customers.
                </p>
              </li>
            </ul>
          </div>
        </article>
      </div>
      <div className="last-presentation">
        <section className="co-working">
          <p>Key Associated companies and projects we're in</p>
          <ul>
            <li>
            <a href="https://www.pagstar.com" target="_blank" rel="noopener noreferrer">
                <Image src="/img/Pagstar.png" alt="Company 1" width={100} height={50} />
              </a>
            </li>
            <li>
            <a href="https://admin.nvpro.com.br/" target="_blank" rel="noopener noreferrer">
                <Image src="/img/Nvpro.png" alt="Company 2" width={100} height={50} />
              </a>
            </li>
            <li id="third-img">
            <a href="https://www.remoteagro.com.br/" target="_blank" rel="noopener noreferrer">
                <Image src="/img/Remote Agro.png" alt="Company 3" width={100} height={50} />
              </a>
            </li>
          </ul>
          <div id="Isolated-Img">
          <a href="https://www.metareports.com.br" target="_blank" rel="noopener noreferrer">
              <Image src="/img/META.png" alt="Company 4" width={100} height={50} />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
