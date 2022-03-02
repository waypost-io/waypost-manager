--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.9 (Ubuntu 12.9-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: flags; Type: TABLE; Schema: public; Owner: caleb
--

CREATE TABLE public.flags (
    id integer NOT NULL,
    app_id integer,
    name character varying(100),
    description character varying(255),
    status boolean,
    date_created date,
    date_edited date,
    last_toggle date
);


ALTER TABLE public.flags OWNER TO caleb;

--
-- Name: flags_id_seq; Type: SEQUENCE; Schema: public; Owner: caleb
--

CREATE SEQUENCE public.flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.flags_id_seq OWNER TO caleb;

--
-- Name: flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: caleb
--

ALTER SEQUENCE public.flags_id_seq OWNED BY public.flags.id;


--
-- Name: flags id; Type: DEFAULT; Schema: public; Owner: caleb
--

ALTER TABLE ONLY public.flags ALTER COLUMN id SET DEFAULT nextval('public.flags_id_seq'::regclass);


--
-- Data for Name: flags; Type: TABLE DATA; Schema: public; Owner: caleb
--

COPY public.flags (id, app_id, name, description, status, date_created, date_edited, last_toggle) FROM stdin;
1	\N	Test Flag 1	This is a test description	t	2021-03-02	2021-03-02	2021-03-02
2	\N	Test Flag 2	This is another test description	t	2021-03-01	2021-03-01	2021-03-01
3	\N	Test Flag 3	This is another test description	f	2021-02-28	2021-02-28	2021-02-28
4	\N	Test Flag 4	This is another test description	f	2021-02-27	2021-02-27	2021-02-27
5	\N	Test Flag 5	This is another test description	t	2021-02-26	2021-02-26	2021-02-26
\.


--
-- Name: flags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: caleb
--

SELECT pg_catalog.setval('public.flags_id_seq', 5, true);


--
-- PostgreSQL database dump complete
--

